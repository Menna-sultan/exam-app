import LoginForm from "@/features/auth/componentes/login/login-form";
import Link from "next/link";


export default function Page() {
    return (
      
              <main className="w-full h-full flex flex-col justify-center items-center py-12 px-4">
                <div className="w-full max-w-[450px] mx-auto flex flex-col gap-10">
        {/* Title */}
        <h2 className="font-inter text-3xl font-bold text-gray-800  text-left">
          Login
        </h2>

                <LoginForm />
                
                  
          <p className="text-sm  text-gray-500 font-medium text-center ">Don't have account? 
            <Link href="/register" className="text-blue-600">Register</Link>








             
          </p>
        </div>
      </main>
    )
        }
