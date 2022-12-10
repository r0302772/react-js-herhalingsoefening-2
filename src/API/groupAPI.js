import getUser from './utils/getUser.js'
import supabaseClient from './utils/supabaseClient.js'

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
 * Retrieve an array of all groups that match the specified search term and to which the current user is subscribed.
 * The results are optionally paginated.
 *
 * @return {Promise<Array<{
 *  id: string,
 *  name: string,
 *  owner: {id: string, username: string, avatar: string, name: string, firstName: string},
 *  description: string,
 *  isPrivate: boolean
 *  }>>} The groups that the logged-in user is subscribed to.
 */
const fetchAllSubscribedGroups = async () => {
    const {id} = await getUser()

    if (!id) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const query = supabaseClient
        .from('subscription')
        .select('group:groupId(*, owner:owner(*))')
        .eq('userId', id)

    const {data, error} = await query

    if (error) {
        throw error
    }

    return data.map(g => g.group)
}

/**
 * Retrieve an array of all groups that match the specified search term. The result are optionally paginated.
 *
 * @param searchTerm {string} The text with which a group's name must begin.
 * @return {Promise<Array<{
 *  id: string,
 *  name: string,
 *  owner: {id: string, username: string, avatar: string, name: string, firstName: string},
 *  description: string,
 *  isPrivate: boolean
 *  }>>} The public groups.
 */
const fetchAllPublicGroups = async ({searchTerm}) => {
    const query = supabaseClient
        .from('group')
        .select(`
                *,
               owner:owner(*)
            `)
        .ilike('name', `${searchTerm}%`)
        .eq('isPrivate', false)

    const {data, error} = await query

    if (error) {
        throw error
    }

    return data
}


/**
 * Create a new group.
 *
 * @param name {string} The name of the new group.
 * @param description {string} A description for the new group.
 * @param isPrivate {boolean} If true, the group will only be accessible to the user that created it
 * (and whoever he/she adds).
 * @return {Promise<{id: string, name: string, owner: string, description: string, isPrivate: boolean}>} The the newly
 * created group.
 */
const createGroup = async ({name, description, isPrivate}) => {
    const {id: owner} = await getUser()

    if (!owner) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const {data, error} = await supabaseClient
        .from('group')
        .insert({owner, name, isPrivate, description})
        .select()
        .single()

    if (error) {
        throw error
    }

    await joinGroup({groupId: data.id})

    return data
}


/**
 * Retrieve a group using its id.
 *
 * @param id {number} The id of the group which must be retrieved.
 * @return {Promise<{
 *     id: string,
 *     name: string,
 *     owner: {
 *         id: string,
 *         username: string,
 *         updatedAt: string,
 *         avatar: string,
 *         name: string,
 *         firstName: string
 *     },
 *     description: string,
 *     createdAt: string,
 *     isPrivate: boolean,
 *     posts: Array<{
 *         id: string,
 *         title: string,
 *         content: string,
 *         createdAt: string,
 *         user: {
 *             id: string,
 *             username: string,
 *             updatedAt: string,
 *             avatar: string,
 *             name: string,
 *             firstName: string
 *         },
 *         groupId: string,
 *         parentId: (string | undefined)
 *     }>,
 *     members: Array<{
 *         username: string,
 *         id: string
 *     }>
 * }>}
 */
const fetchGroup = async ({id}) => {
    const {data: groupData, error: groupError} = await supabaseClient
        .from('group')
        .select('*, owner:owner(*)')
        .eq('id', id)
        .single()

    if (groupError) {
        throw groupError
    }

    // Fetch the posts for the group.
    const {data: postData, error: postError} = await supabaseClient
        .from('posts')
        .select('*, user:userId(*)')
        .eq('groupId', id)
        .is('parentId', null)
        .order('createdAt', {ascending: false})

    if (postError) {
        throw postError
    }

    // Fetch the users for the group.
    const {data: userData, error: userError} = await supabaseClient
        .from('subscription')
        .select('user:userId(id, username)')
        .eq('groupId', id)

    if (userError) {
        throw userError
    }

    groupData.posts = postData
    groupData.members = userData.map(u => u.user)

    return groupData
}


/**
 * Add the current user to the requested group.
 *
 * @param groupId {string} The group to which the current user must be subscribed.
 */
const joinGroup = async ({groupId}) => {
    const {id: userId} = await getUser()

    if (!userId) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const {error} = await supabaseClient
        .from('subscription')
        .insert({userId, groupId})

    if (error) {
        throw error
    }
}

/**
 * Add a given user to a given group.
 *
 * @param groupId {string} The group to which the given user must be subscribed.
 * @param userId {string} The id of the user that is to be added to the group.
 */
const addUserToGroup = async ({groupId, userId}) => {
    const {error} = await supabaseClient
        .from('subscription')
        .insert({userId, groupId})

    if (error) {
        throw error
    }
}

/**
 * Create a new post in a specified group.
 *
 * @param title {string} The title of the post.
 * @param content {string} The content of the post
 * @param groupId {string} The id of the group.
 * @return {Promise<{
 *    id: string,
 *    username: string,
 *    updatedAt: string,
 *    avatar: string,
 *    name: string,
 *    firstName: string
 * }>}
 */
const createPost = async ({content, groupId, title}) => {
    const {id: userId} = await getUser()

    if (!userId) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const newPost = {
        title,
        content,
        groupId,
        userId
    }

    const {error, data} = await supabaseClient
        .from('posts')
        .insert(newPost)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

/**
 * Delete the post with the specified id.
 *
 * @param groupId {string} The id of the group that contains the post that is to be deleted.
 * @param id {string} The id of the post that is to be deleted.
 * @return {Promise<void>}
 */
const deletePost = async ({groupId, id}) => {
    const {error} = await supabaseClient
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}

/**
 * Delete the comment with the specified id.
 *
 * @param parentId {string} The id of the parent post.
 * @param id {string} The id of the comment that is to be deleted.
 * @return {Promise<void>}
 */
const deleteComment = async ({parentId, id}) => {
    const {error} = await supabaseClient
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}

/**
 * Remove the current user from the given group.
 *
 * @param groupId {string} The id of the group from which the current user must be removed.
 */
const leaveGroup = async ({groupId}) => {
    const {id: userId} = await getUser()

    if (!userId) {
        throw new Error(`Can't update the profile, login first.`)
    }

    const {error} = await supabaseClient
        .from('subscription')
        .delete()
        .eq('userId', userId)
        .eq('groupId', groupId)

    if (error) {
        throw error
    }
}

/**
 * Remove a given user from a given group.
 *
 * @param groupId {string} The id of the group to which the user must added.
 * @param userId {string} The id of the user that is to be removed from the given group.
 */
const removeUserFromGroup = async ({groupId, userId}) => {
    const {error} = await supabaseClient
        .from('subscription')
        .delete()
        .eq('userId', userId)
        .eq('groupId', groupId)

    if (error) {
        throw error
    }
}

/**
 * Retrieve the post with the given id and all the first level comments for this post.
 *
 * @param id {string} The id of the post that must be retrieved.
 * @returns {Promise<Array<{
 *     id: string,
 *     createdAt: string,
 *     userId: string,
 *     user: {
 *         id: string,
 *         username: string,
 *         updatedAt: string,
 *         avatar: string,
 *         name: string,
 *         firstName: string
 *     },
 *     groupId: string,
 *     parentId: string,
 *     title: string,
 *     content: string,
 *     comments: Array<{
 *         id: string,
 *         createdAt: string,
 *         userId: string,
 *         user: {
 *             id: string,
 *             username: string,
 *             updatedAt: string,
 *             name: string,
 *             firstName: string
 *         },
 *         groupId: string,
 *         parentId: string,
 *         title: string,
 *         content: string
 *     }>
 * }>>}
 */
const fetchPost = async (id) => {
    const {data: postData, error: postError} = await supabaseClient
        .from('posts')
        .select('*, user:userId(*)')
        .eq('id', id)
        .single()

    if (postError) {
        throw postError
    }

    const commentsData= await fetchCommentsForPost({postId: id})

    postData.comments = commentsData

    return postData
}

/**
 * Retrieve comments for a specific post, the results are ordered from newest to oldest.
 *
 * @param postId The if of the post for which the comments must be retrieved.
 * @returns {Promise<Array<{
 *     id: string,
 *     createdAt: string,
 *     userId: string,
 *     user: {
 *         id: string,
 *         username: string,
 *         updatedAt: string,
 *         avatar: string,
 *         name: string,
 *         firstName: string
 *     },
 *     groupId: string,
 *     parentId: string,
 *     title: undefined,
 *     content: string
 * }>>}
 */
const fetchCommentsForPost = async ({postId}) => {
    const {data, error} = await supabaseClient
        .from('posts')
        .select('*, user:userId(*)')
        .eq('parentId', postId)
        .order('createdAt')

    if (error) {
        throw error
    }

    return data
}

/**
 * Create a new comment for a given post.
 *
 * @param content {string} The content of the comment.
 * @param groupId {string} The id of the group in which the comment is to be placed.
 * @param parentId {string} The id of the parent post, the post/comment to which the comment is reply.
 * @return {Promise<{
 *     id: string,
 *     content: string,
 *     createdAt: string,
 *     userId: string,
 *     groupId: string,
 *     parentId: string,
 *     title: undefined
 * }>}
 */
const createComment = async ({content, groupId, parentId}) => {
    const {id: userId} = await getUser()

    if (!userId) {
        throw new Error(`Can't create a new post, login first.`)
    }

    const newComment = {
        content,
        groupId,
        userId,
        parentId
    }

    const {data, error} = await supabaseClient
        .from('posts')
        .insert(newComment)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}
//endregion
