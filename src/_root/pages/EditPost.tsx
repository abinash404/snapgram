import PostForm from '@/components/forms/PostForm'
import { useGetPostById } from '@/components/lib/react-query/queriesAndMutations'
import Loader from '@/components/shared/Loader'
import { useParams } from 'react-router-dom'

const EditPost = () => {
  const {id} = useParams()
  const {data: post , isPending} = useGetPostById(id || '')

  if(isPending) return <Loader/>
  return (
    <div className='flex flex-1'>
    <div className='common-container'>
      <div className='max-w-5xl flex-this.state gap-3 justify-start'>
        <img
        src="/public/assets/icons/add-post.svg"
        width={36}
        height={36}
        alt="add"
        />
        <h2 className='h3-bold md:h2-bold text-left w-full'>edit post</h2>
      </div>



      <PostForm action="Update" post={post}/>


    </div>
  </div>
  )
}

export default EditPost