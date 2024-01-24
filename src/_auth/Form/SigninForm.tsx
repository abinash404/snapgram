// import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/components/lib/validation"
import { Link,useNavigate } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import {  useSignInAccount } from "@/components/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/contexts/AuthContext"




// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })
function Signin() {


  const navigate = useNavigate()
  const { toast } = useToast()
  const {checkAuthUser , isLoading: isUserLoading} = useUserContext()




const {mutateAsync: signInAccount} = useSignInAccount()


  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      
      email: "",
      password:"",
    },
  })


  // 2. Define a submit handler.
  async function onSubmit(user: z.infer<typeof SigninValidation>) {
    //creating newuser
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "Login failed. Please try again." });
      
      return;
    }

    const isLoggedIn = await checkAuthUser();

      

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
    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">login to your account</h2>
    <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         


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
            { isUserLoading ? (
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


export default Signin