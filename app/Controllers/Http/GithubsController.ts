import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';

export default class GithubController {
    public async fetchPrivateRepos({ response }: HttpContextContract) {
        const appId = parseInt(process.env.GITHUB_APP_ID || '');
        const installationId = parseInt(process.env.GITHUB_INSTALLATION_ID || '');
        const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH || '';
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

        const octokit = new Octokit({
            authStrategy: require('@octokit/auth-app').createAppAuth,
            auth: {
                appId,
                privateKey,
                installationId,
            },
        });

        try {
            const repos = await octokit.repos.listForAuthenticatedUser({
                visibility: 'private',
            });

            return response.json(repos.data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Error fetching repositories' });
        }
    }
}
