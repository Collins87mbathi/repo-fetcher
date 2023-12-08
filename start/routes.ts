import Route from '@ioc:Adonis/Core/Route'

Route.get('/private-repositories', 'GithubController.fetchPrivateRepos')
