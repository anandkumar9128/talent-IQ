import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
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
        <SignedOut/>
      </SignedIn>
      <UserButton/>
    </>
  )
}

export default App
 