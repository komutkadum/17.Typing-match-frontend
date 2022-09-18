import { useState } from "react";
import IntroBoard, { UsernameConnected } from "./components/IntroBoard";
import TypingBoard from "./components/TypingBoard";

function App() {
  const [user,setUser] = useState(false);
  const [join, setJoin] = useState(false);
  const [username, setUsername] = useState("");
  const [otherUsername , setOtherUsername] = useState("");
  const [otherId, setOtherId] = useState("");
  const [textIndex, setTextIndex] = useState(0);

  return (
    <div className="App"> 
        {
          user&&
          <UsernameConnected username={username}/>
        }
        {
          user?
            <TypingBoard 
              otherUsername={otherUsername} 
              otherId={otherId} 
              textIndex={textIndex}
              username={username}/>:
            <IntroBoard 
            setTextIndex={setTextIndex}
              username={username} 
              setOtherId={setOtherId} 
              join={join}
              setJoin={setJoin}
              setOtherUsername={setOtherUsername} 
              setUsername={setUsername}  
              setUser={setUser}/>
        }

        {
          !user && <SocialMediaFooter />
        }
    </div>
  );
}

const SocialMediaFooter = () => {
  return (<div className="social-media">
          <a href="mailto:kadumkomut2826@gmail.com" title="Gmail" target="_blank" rel="noreferrer"><div className="google">
            <i className="fab fa-google"></i></div>
          </a>
          <a href="https://www.facebook.com/kadum.komut.9" title="Facebook" target="_blank" rel="noreferrer">
            <div className="facebook"><i className="fab fa-facebook-f"></i></div>
          </a>
          <a href="https://twitter.com/kadumkomut3" title="Twitter" target="_blank" rel="noreferrer"><div className="twitter"><i className="fab fa-twitter"></i></div></a>
          <a href="https://www.linkedin.com/in/kadum-komut-67023012b/" title="LinkedIn" target="_blank" rel="noreferrer"><div className="linkedin"><i className="fab fa-linkedin-in"></i></div></a>
          <a href="https://github.com/komutkadum" title="Github" target="_blank" rel="noreferrer"><div className="github"><i className="fab fa-github"></i></div></a>
        </div>);
}

export default App;
