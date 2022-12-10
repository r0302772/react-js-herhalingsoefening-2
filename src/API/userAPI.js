import supabaseClient from './utils/supabaseClient.js'
import getUser from './utils/getUser.js'

//region Mutations & queries
/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */


//endregion

//region Supabase functions
/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          Supabase functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * Log in with an email account and password.
 *
 * @param email The email address that will be used to identify the user.
 * @param password The user's password.
 */
const login = async ({email, password}) => {
    const {error} = await supabaseClient.auth.signInWithPassword({email, password})
    if (error) {
        throw error
    }
}

/**
 * Register a new account
 * @param email
 * @param password
 * @param username
 * @return {Promise<void>}
 */
export const register = async ({email, password, username}) => {
    if (email === '' || password === '' || username === '' || !email || !password || !username) {
        throw new Error(`Email, password and username must be defined and can't be an empty string.`)
    }

    const {error} = await supabaseClient.auth.signUp({email, password})

    if (error) {
        throw error
    }

    const {error: profileError} = await upsertProfile({
        username
    })

    if (profileError) {
        throw error
    }
}


/**
 * Upload a file to the Storage bucket, upserts
 *
 * @param avatar {File}
 * @return {Promise<string>}
 */
const uploadAvatar = async (avatar) => {
    if (!avatar) {
        throw new Error(`The image isn't defined.`)
    }

    if (avatar.size > 512000) {
        throw new Error(`The image is to big, it must be smaller than or equal to 512 bytes`)
    }

    const {id} = await getUser()

    if (!id) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const path = `${id}.${avatar.type.split('/').at(-1)}`
    const {error} = await supabaseClient
        .storage
        .from('avatars')
        .upload(path, avatar, {upsert: true})

    if (error) {
        throw error
    }

    const {data: {publicUrl}} = supabaseClient
        .storage
        .from('avatars')
        .getPublicUrl(path)

    return publicUrl
}

/**
 * Retrieve the profile and id of the currently logged-in user.
 *
 * @return {Promise<{id: string, username: string, avatar: string, name: string, firstName: string}>}
 */
const fetchProfile = async () => {
    const user = await getUser()

    if (!user) {
        return null
    }

    const {data, error} = await supabaseClient
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .maybeSingle()

    if (error) {
        throw error
    }

    return {
        id: user?.id,
        ...data,
    }
}


/**
 * Update or insert a user's profile. Each parameter is optional, if no value is provided the old value, that is already
 * in the DB, will be used.
 *
 * @param username {string | undefined} The new username that will be used to identify the user.
 * @param avatar {File | undefined} The URL of the user avatar or a File to be uploaded
 * @param firstName {string | undefined} The first name of the user.
 * @param name {string | undefined} The surname of the user.
 * @return {Promise<{id: string, username: string, avatar: string, name: string, firstName: string}>} The updated
 * profile.
 */
const upsertProfile = async ({username, avatar, firstName, name}) => {
    const profile = await fetchProfile()

    let avatarURL = `https://ui-avatars.com/api/?background=random&name=${username.replace(' ', '+')}&rounded=true&format=svg`
    if (avatar && avatar instanceof File) {
        avatarURL = await uploadAvatar(avatar)
    }

    const updates = {
        id: profile.id,
        updatedAt: new Date(),
        username: username ?? profile?.username,
        avatar: avatarURL,
        firstName: firstName ?? profile?.firstName,
        name: name ?? profile?.name
    }

    let {error, data} = await supabaseClient
        .from('profiles')
        .upsert(updates)
        .select()

    if (error) {
        throw error
    }

    return data
}


/**
 * Fetch all profiles that match the given username query. The currently logged in user won't be returned.
 *
 * @param username {string} A search string, the string will match anything at the start, middle or end of the username.
 * @return {Promise<Array<{
 *     id: string,
 *     updatedAt: string,
 *     username: string,
 *     avatar: string
 * }>>} An array of all the matching profiles.
 */
const fetchProfiles = async ({username}) => {
    const {id} = await getUser()

    if (!id) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const {data, error} = await supabaseClient
        .from('profiles')
        .select()
        .neq('id', id)
        .ilike('username', `%${username}%`)

    if (error) {
        throw error
    }
    return data
}

//end region
