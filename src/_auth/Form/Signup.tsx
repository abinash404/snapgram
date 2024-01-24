// import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/components/lib/validation"
import { Link,useNavigate } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import { createUserAccount } from "@/components/lib/appwright/api"
import { useCreateUserAccount, useSignInAccount } from "@/components/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/contexts/AuthContext"




// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })
function Signup() {


  const navigate = useNavigate()
  const { toast } = useToast()
  const {checkAuthUser , isLoading: isUserLoading} = useUserContext()


const {mutateAsync:createUserAccount ,isPending:isCreatingAccount} = useCreateUserAccount()


const {mutateAsync: signInAccount , isPending:isSigningIn} = useSignInAccount()


  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:"",
      username: "",
      email: "",
      password:"",
    },
  })


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    //creating newuser
    const newUser = await createUserAccount(values)

    if(!newUser){
      return  toast({
        title:'signup faild.plese try again'
      })
    }
      const session = await signInAccount({
        email:values.email,
        password: values.password,
      })
      if(!session){
        return  toast({
          title:'signin faild.plese try again letter'
        }
      )

    }
    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn){
      form.reset();

      navigate('/')
    }else{
      return toast({
          title:'signup faild.plese try again letter'
        })
    }
  }
  
  return (
    
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
    <img src="../../../public/assets/images/logo.svg"/>
    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
    <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input"{...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
              
            )} />

            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>userName</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input"{...field} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
              
            )} />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input"{...field} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
              
            )} />
            

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input"{...field} />
                </FormControl>
                
                <FormMessage />
              </FormItem>
              
            )} />

<Button type="submit" className="shad-button_primary">
            { isCreatingAccount ? (
              <div className="flex-center gap-2">
                 <Loader/> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
        </div>
      </Form>
    
  )
}


export default Signup