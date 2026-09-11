import React from "react"
import clsx from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"



export default function AssemblyEndGame() {

    const [currentWord, setCurrentWord]= React.useState(()=>getRandomWord())
    const [guessedLetters, setGuessedLetters]= React.useState([])

    const wrongGuessCount=
    guessedLetters.filter(letter=> !currentWord.includes(letter)).length

    const isGameWon=
       currentWord.split("").every(letter=> guessedLetters.includes(letter))

    const isGameLost = wrongGuessCount >= languages.length-1

    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter= guessedLetters[guessedLetters.length-1]
    const isLastGuessIncorrext= lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    const numGuessesleft= languages.length-1-wrongGuessCount

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetters(letter){
        setGuessedLetters(PrevLetters =>
            PrevLetters.includes(letter)? PrevLetters: [...PrevLetters, letter]
        )
    }


    const languageElements= languages.map((lang, index)=> {
        const isLanguageLost= index<wrongGuessCount
        const styles={
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
        <span className= {className} 
        style={styles}
        key={lang.name}
        >
            {lang.name}
            </span>
    )
})

const letterElements= currentWord.split("").map((letter, index)=> {
    const shouldRevealLetter= isGameLost || guessedLetters.includes(letter)
    const letterClassName= clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
 <span key={index} className="letterClassName">
        {shouldRevealLetter? letter.toUpperCase():""}
        </span>
    )
   
});

const keyboardElements= alphabet.split("").map(letter=> 
    {
        const isGuessed= guessedLetters.includes(letter);
        const isCorrect= isGuessed && currentWord.includes(letter);
        const isWrong= isGuessed && !currentWord.includes(letter);
        const className= clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        return (
    <button
     key={letter}
     disabled={isGameOver} 
    className={className}
    aria-disabled={guessedLetters.includes(letter)}
    aria-label={`Letter ${letter}`}
    onClick={()=>addGuessedLetters(letter)}
    >
        {letter.toUpperCase()}
        </button>

)
    }
)

const gameStatusClass= clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrext
})

function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrext){
        return(
            <p className="farewell-message">
                { getFarewellText(languages[wrongGuessCount-1].name)}
            </p>
        );
    }

    if(isGameWon){
        return(
           <> 
                <h2>You Win!</h2>
                <p> Well Done! 🎉</p>
           </>
        )
    }

    if(isGameLost){
        return(
              <> 
                <h2>Game Over!</h2>
                <p> You lose! Better Learning Assembly 😭</p>
              </>
        )
    }

    return null
}

function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
}

    return (
       <main>
       {
           isGameWon && 
           < Confetti
           recycle={false}
           numberOfPieces= {1000}/>
       }
        <header>
            <h1> Assembly: EndGame </h1>
            <p>Guess the word within 8 attempts to keep the 
                programming world safe from Assembly!</p>
        </header>
        <section 
        aria-live="polite"
        role="status"
        className={gameStatusClass}>
            {renderGameStatus()}
        </section>
        <section className="language-chips">
                { languageElements }
        </section>
        <section className="word">
            {letterElements }
        </section>

{/* Combined visually-hidden aria-live region for status updates */}
        <section className="sr-only" 
        aria-live="polite" 
        role="status">
        <p>
            { currentWord.includes(lastGuessedLetter)?
            `Correct! The letter ${lastGuessedLetter} is in the word` :
            `Sorry! The letter ${lastGuessedLetter} is not in the word`}
You have {numGuessesleft} attempts left. </p>
        <p>
            Current word: {currentWord.split("").map(letter =>
                guessedLetters.includes(letter)? letter+"." : "blank."
            ).join(" ")
            }
        </p>
        </section>
        <section className="keyboard">
            {keyboardElements}
        </section>
        { isGameOver && <button className="new-game" onClick={startNewGame}> 
            New Game
        </button> }
       </main>
    )
}