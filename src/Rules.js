const Rules = (props) => {
  return (
    <div className={props.appearance}>
      <div className="rules-wrapper">
        <div className="rules-inner-wrap">
          <h1>Da Rules</h1>
          <ol>
            <li>Select a playlist.</li>
            <li>You'll be taken to a new screen. When you're ready, hit "start game."</li>
            <li>Four random albums will appear on the screen. A song from your selected playlist will also play in the background, beginning one minute into the song.</li>
            <li>Choose the correct album that song's from within 10 seconds to win and score points!</li>
            <li>Hit "start game" to begin a new game.</li>
          </ol>
          <p>You can earn a maximum of 6 points per round, with 2 points deducted for each incorrect guess.</p>
          <p>Have fun, kid!</p>
          <button className="close-btn" onClick={() => {props.setAppearance('rules hide')}}>close</button>
        </div>
      </div>
    </div>
  )
}

export default Rules
