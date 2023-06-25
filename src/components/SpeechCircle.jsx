import VoiceAnimation from "./VoiceAnimation";
function SpeechCircle({ handleListen, bgColor, colors, speaking, click }) {
  return (
    <div
      onClick={handleListen}
      className={`${colors[bgColor]} cursor-pointer max-w-[500px] max-h[500px] w-[500px] sm:w-80 lg:w-90 h-[500px] sm:h-80 lg:h-90 rounded-full mx-auto border-[#242424] border-2 hover:border-white`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!speaking && click && (
        <h1 className="font-bold text-center text-2xl">Click here</h1>
      )}
      {click === false && speaking === false && (
        <h1 className="font-bold text-center text-2xl">Speak</h1>
      )}
      {speaking && <VoiceAnimation speaking={speaking} />}
    </div>
  );
}

export default SpeechCircle;
