const InputForm = ({ handleSubmit, handleChange }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Desert:</label>
        <br />
        <input type="text" name="desert" id="desert" onChange={handleChange} />
        <br />
        <label>Calories(g):</label>
        <br />
        <input
          type="number"
          name="calories"
          id="calories"
          onChange={handleChange}
        />
        <br />
        <label>Fat:</label>
        <br />
        <input type="number" name="fat" id="fat" onChange={handleChange} />
        <br />
        <label>Carbs:</label>
        <br />
        <input type="number" name="carbs" id="carbs" onChange={handleChange} />
        <br />
        <label>Protein:</label>
        <br />
        <input
          type="number"
          name="protein"
          id="protein"
          onChange={handleChange}
        />
        <br />
        <input type="submit" value="Add Order" />
      </form>
    </div>
  );
};

export default InputForm;
