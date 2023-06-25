function Transcript({ transcript, response }) {
  return (
    <div className="w-1/3 md:w-1/2 sm:w-full sm:px-8 mx-auto my-4 flex flex-col gap-4">
      <p>
        <span className="text-lg font-extrabold mr-2 text-blue-400">You: </span>
        {transcript}
      </p>
      <p>
        <span className="text-lg font-extrabold mr-2 text-green-400">
          Bud-e:
        </span>
        {response}
      </p>
    </div>
  );
}

export default Transcript;
