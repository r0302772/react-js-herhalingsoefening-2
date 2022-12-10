import supabaseClient from './supabaseClient.js'

/**
 *
 * @return {Promise<{id: string}|undefined>}
 */
const getUser = async () => {
    const { data: {session}, error: sessionError } = await supabaseClient.auth.getSession()

    if (sessionError) {
        throw new Error(`The following error occurred while retrieving the session data: ${sessionError}`)
    }

    if (!session) {
        return undefined
    }

    const { data: { user }, error: userError }= await supabaseClient.auth.getUser()

    if (userError) {
        throw new Error(`The following error occurred while retrieving the user data: ${sessionError}`)
    }

    if (!user?.id) {
        throw new Error(`Couldn't retrieve the currently logged in user.`)
    }

    return user
}

export default getUser
