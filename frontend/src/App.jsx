import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {

  return (
    <>
       <h1>Welcome to the app</h1>
      <SignedOut>
        <SignInButton mode='modal'>
          <button className=''>
            Login
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <UserButton/>
    </>
  )
}

export default App
 