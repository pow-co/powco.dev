

import * as models from './models'

import { Transaction } from 'bsv'

import * as boostpow from 'boostpow'

import { run } from './run'

import { log } from './log'

import { getTimestamp } from './whatsonchain'

export async function importProofsFromTxId({tx_id}: { tx_id: string}): Promise<any[]> {

    const proofs = await models.BoostPowProof.findAll({
        where: {
            txid: tx_id
        }
    })

    if (proofs.length > 0) {

        return proofs
    }

    const tx_hex = await run.blockchain.fetch(tx_id)

    log.info('boostpow.importProofFromTxId', { tx_id, tx_hex })

    return importProofsFromTxHex({tx_hex})
    
}

export async function importProofsFromTxHex({tx_hex}: {tx_hex: string}): Promise<any[]> {

    const tx = new Transaction(tx_hex)

    const proofs = await models.BoostPowProof.findAll({
        where: {
            txid: tx.hash
        }
    })

    if (proofs.length > 0) {

        return proofs
    }

    let proof = boostpow.BoostPowJobProof.fromRawTransaction(tx_hex)

    if (!proof) {

        log.info('planaria.importProofFromTxHex.proofNotFound', { tx_hex })

        return
        
    }

    const timestamp = await getTimestamp(proof.txid)

    const job_tx = await run.blockchain.fetch(proof.spentTxid)

    console.log("JOB TX", job_tx)

    const job: boostpow.Job = boostpow.Job.fromRawTransaction(job_tx)

    if (!job) { return }

    console.log('_______JOB_____', job)

    console.log('-------PROOF-------', proof.toObject())

    const defaults = Object.assign({
        txid: proof.txid,
        vin: proof.vin,
        timestamp,
        content: job.toObject().content,
        difficulty: job.difficulty,
        job_txid: job.txid,
        job_vout: job.vout
    })

    console.log("boostpowProof.findOrCreate", {defaults})

    const [record, isNew] = await models.BoostPowProof.findOrCreate({
        where: {
          txid: proof.txid,
          vin: proof.vin
        },
        defaults
    })

    return [record]

}
