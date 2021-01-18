/**************************************************
 * FOLLOW -> {
 *      author: follower(who made the follow)
 *      user: following(whose bening followed)
 *      contentId: follower
 * }
 * POST -> {
 *      author: puplisher
 *      user: following of the puplisher
 *      contentId: post
 * }
 * LIKE -> {
 *      author: who liked the post
 *      user: post owenr
 *      contentId: post
 * }
 * COMMENT -> {
 *      author: who made the comment
 *      user: post onwer & commenters (set)
 *      contentId: post
 * }
 * GROUP_REQUEST -> {
 *      author: who made the request
 *      user: group admin
 *      contentId: group
 * }
 * GROUP_ADD -> {
 *      author: group admin
 *      user: who being add by admin
 *      contentId: group
 * }
 * GROUP_POST -> {
 *      author: post author
 *      user: group members
 *      contentId: post
 * }
 **************************************************/

/*************************************************
 *
    [
        {
            path: 'posts',
            populate: [
                { path: 'user' },
                { path: 'likes' },
                { path: 'comments.user' }
            ],
            limit: 1
        },
        {
            path: 'sharedPosts',
            populate: [
                { path: 'user' },
                { path: 'likes' },
                { path: 'comments.user' }
            ],
            limit: 1
        },
        {
            path: 'following',
            populate: [
                {
                    path: 'posts',
                    populate: [
                        { path: 'user' },
                        { path: 'likes' },
                        { path: 'comments.user' }
                    ],
                    limit: 1
                },
                {
                    path: 'sharedPosts',
                    populate: [
                        { path: 'user' },
                        { path: 'likes' },
                        { path: 'comments.user' }
                    ],
                    limit: 1
                }
            ]
        },
        {
            path: 'groups',
            populate: {
                path: 'posts',
                populate: [
                    { path: 'user' },
                    { path: 'likes' },
                    { path: 'comments.user' }
                ],
                limit: 1
            }
        },
        {
            path: 'pages',
            populate: {
                path: 'posts',
                populate: [
                    { path: 'user' },
                    { path: 'likes' },
                    { path: 'comments.user' }
                ],
                limit: 1
            }
        },
    ]
 ***********************************************/