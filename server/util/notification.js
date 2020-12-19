/**************************************************
 * FOLLOW -> {
 *      authorId: follower(who made the follow)
 *      userId: following(whose bening followed)
 *      contentId: follower
 * }
 * POST -> {
 *      authorId: puplisher
 *      userId: following of the puplisher
 *      contentId: post
 * }
 * LIKE -> {
 *      authorId: who liked the post
 *      userId: post owenr
 *      contentId: post
 * }
 * COMMENT -> {
 *      authorId: who made the comment
 *      userId: post onwer & commenters (set)
 *      contentId: post
 * }
 *
 **************************************************/