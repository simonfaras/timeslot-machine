const EntryInput = ({ onChange, start, end, activity }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const values = Array.from(e.target.elements)
      .filter((element) => element.nodeName === "INPUT")
      .reduce(
        (acc, input) => ({
          ...acc,
          [input.name]: input.value,
        }),
        {}
      );

    onChange(values);
    e.target.reset();
    e.target[0].focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="entry entry-input">
        <div className="timespan">
          <input type="time" name="start" defaultValue={start} required />
          <span className="separator">-</span>
          <input type="time" name="end" defaultValue={end} required />
        </div>
        <div className="description">
          <input type="text" name="activity" defaultValue={activity} required />
          <button type="submit">Spara</button>
        </div>
      </div>
    </form>
  );
};

export default EntryInput;
