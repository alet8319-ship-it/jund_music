import './App.css';
import { SignedIn, SignedOut, SignInButton, UserButton, ClerkLoaded } from '@clerk/clerk-react';
import Upload from './components/Upload';
import MusicList from './components/MusicList';

export default function App() {
  return (
    <ClerkLoaded>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#676869ff',
          color: 'white',
        }}
      >
        <h1 style={{ margin: 0 }}>🎵 Jund Music</h1>

        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <SignedIn>
          <Upload />
          <MusicList />
        </SignedIn>

        <SignedOut>
          <p>Please sign in to access the app.</p>
        </SignedOut>
      </main>
    </ClerkLoaded>
  );
}
