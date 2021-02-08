import "./design.css";

const onChange = () => {};

const Design = () => {
  return (
    <div className="root">
      <div className="wrapper">
        <div className="day">
          <div className="header">
            <span className="title">Måndag - 8/12</span>
            <span className="summary">6 tim 10 min</span>
          </div>

          <div className="entry">
            <div className="timespan">
              <input type="time" value="08:15" onChange={onChange} />
              <span className="separator">-</span>
              <input type="time" value="09:30" onChange={onChange} />
            </div>
            <div className="description">Jobb</div>
          </div>
          <div className="entry">
            <div className="timespan">
              <input type="time" value="" onChange={onChange} />
              <span className="separator">-</span>
              <input type="time" value="" onChange={onChange} />
            </div>
            <div className="description">
              Jobb <span className="entry-summary">({6.5})</span>
            </div>
          </div>
        </div>
        <div className="day">
          <div className="header">
            <span className="title">Måndagasdads - 8/12</span>
            <span className="summary">6 tim 10 min</span>
          </div>
          <div className="entry">
            <div className="timespan">
              <input type="time" value="" onChange={onChange} />
              <span className="separator">-</span>
              <input type="time" value="" onChange={onChange} />
            </div>
            <div className="description">
              Jobb <span className="entry-summary">({6.5})</span>
            </div>
          </div>
          <div className="entry new-entry">
            <div className="timespan">
              <input type="time" value="" onChange={onChange} />
              <span className="separator">-</span>
              <input type="time" value="" onChange={onChange} />
            </div>
            <div className="description"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
