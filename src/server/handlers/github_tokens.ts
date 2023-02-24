


import { log } from '../../log'

import { badRequest } from 'boom'

import models from '../../models'

import { App, Octokit } from "octokit";

import { getAppPrivateKey, appId } from '../../github'

const { createAppAuth, createOAuthUserAuth } = require("@octokit/auth-app");

import * as github from '../../github'

import { validateAuthToken } from '../../relayx'

export async function create(req, h) {

    try {
        
        const { code, paymail, relayoneAuthToken } = req.payload

        console.log('server.handlers.github_tokens.create', req.payload)

        const result = validateAuthToken(relayoneAuthToken)

        console.log('relayone.auth.result', result)

        if (!result) {
                
                return badRequest('Invalid relayoneAuthToken')
        }

        const appOctokit = new Octokit({
            authStrategy: createAppAuth,
            auth: {
            appId: github.appId,
            privateKey: github.getAppPrivateKey(),
            clientId: process.env.github_client_id,
            clientSecret: process.env.github_client_secret
            },
        });

        const userOctokit: any = await appOctokit.auth({
            type: "oauth-user",
            code,
            factory: (options) => {
            return new Octokit({
                authStrategy: createOAuthUserAuth,
                auth: options,
            });
            },
        });

        const github_user = await userOctokit.request("GET /user");
        
        console.log('user.login', github_user)

        return { github_user, code, paymail }

    } catch(error) {

        console.error('ERROR', error)
        return badRequest(error.response.data)


    }

}

