import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from '../lib/react-query/queriesAndMutations';
import { checkIsLiked } from '../lib/utils';
import Loader from './Loader';



type PostStatsProps = {
    post?: Models.Document;
    userId:string;
}


const PostStats = ({post , userId} : PostStatsProps) => {

  const likeList = post?.likes.map((user:Models.Document) => user.$id)

  const [likes , setLikes] = useState(likeList)
  const [isSaved , setIsSaved] = useState(false)




  const {mutate: likePost} = useLikePost()
  const {mutate: savePost , isPending: isSaveingPost} = useSavePost()
  const {mutate: deleteSavePost , isPending: isDeletingSaved} = useDeleteSavePost()



  const {data: currentUser} = useGetCurrentUser()


  
  const savePostRecord = currentUser ?.save.find
  ((record:Models.Document) => record.post.$id === post?.$id)


useEffect(() => {
  setIsSaved(savePostRecord ? true : false)
},[currentUser])

  const handleLikePost = (e:React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes]

    const hasLikes = newLikes.includes(userId)

    if(hasLikes){
      newLikes = newLikes.filter((id) => id !== userId)
    }else{
      newLikes.push(userId)
    }


    setLikes(newLikes);
    likePost({postId: post?.$id || '', likesArray:newLikes})

  }
  

  const handleSavePost = (e:React.MouseEvent) => {
    e.stopPropagation();

    const savePostRecord = currentUser ?.save.find
    ((record:Models.Document) => record.$id === post?.$id)

   if(savePostRecord){
    setIsSaved(false)
    deleteSavePost(savePostRecord.$id)
   }else{

     savePost({postId: post?.$id || '', userId})
     setIsSaved(true)
   }


  }

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
          
            <img 
            src={`${ checkIsLiked(likes , userId) ? "/public/assets/icons/liked.svg" : "/public/assets/icons/like.svg" }`}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className='cursor-pointer'
            />
            <p className='small-medium lg:base-medium'>{likes.length}</p>
        </div>

        <div className='flex gap-2'>
        {isSaveingPost || isDeletingSaved ? <Loader/> :
            <img 
            src={`${isSaved ? "/public/assets/icons/saved.svg" : "/public/assets/icons/save.svg"}`}
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className='cursor-pointer'
            />}
        </div>
    </div>
  )
}

export default PostStats