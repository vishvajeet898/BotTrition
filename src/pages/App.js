import React, { useState } from 'react';
import { Dropdown, Option } from '../components/Dropdown';
import {
  AnchorButton, Row,
} from '../Components';

// This component will handle the diet lookup feature which will direct user to
// the best overall Diets.
export default function App() {
  const [optionValue, setOptionValue] = useState('');
  const [food, setFoodValue] = useState('');
  const [foods, setFoodsValue] = useState([]);
  const set = new Set();

  const handleSelect = (e) => {
    setOptionValue(e.target.value);
  };
  const handleChange = (e) => {
    setFoodValue(e.target.value);
  };

  function handleSubmit() {
    fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ food_input: food }),
    }).then((response) => response.json())

      .then((json) => {
        if ('error' in json) {
          // TODO: handle error checking here
        }
        if ('foods' in json) {
          // eslint-disable-next-line no-console
          console.log(json);
          setFoodsValue(json.foods);
        }
      });
  }

  return (
    <div>
      <h1>BotTrition</h1>
      <Row>
        <AnchorButton to="/profile" text="View Profile" />
      </Row>
      <h2> Find Out Best Overall Diets</h2>
      <Dropdown
        buttonText="Submit"
        onChange={handleSelect}
        action="https://health.usnews.com/best-diet/best-diets-overall"
      >
        <Option value="Click to see options" />
        <Option value="Mediterranean Diet" />
        <Option value="DASH Diet" />
        <Option value="The Flexitarian Diet" />
        <Option value="Weight Watchers Diet" />
        <Option value="Mayo Clinic Diet" />
        <Option value="The MIND Diet" />
      </Dropdown>
      <p>
        {`You selected ${optionValue}`}
      </p>
      <input
        type="text"
        placeholder="Search..."
        value={food}
        onChange={handleChange}
      />
      <button type="submit" onClick={handleSubmit}>Search</button>
      <ul className="items">
        {foods.slice(10, 30).map((elem) => {
          if (elem.description.toLowerCase() === food.toLowerCase()) {
            return null;// no need to show it in the page
          }
          if (!set.has(elem.description.toLowerCase())) {
            set.add(elem.description.toLowerCase());
            return (
              <>
                <li className="foodDescription">{elem.description}</li>
                <p className="title"> These are the nutrients that are present: </p>
                <div className="listofNutration">
                  {elem.foodNutrients.map((element) => (
                    <p className="nutration">
                      {element.nutrientName}
                      =
                      &nbsp;
                      {element.value}
                      {element.unitName}
                    </p>
                  ))}

                </div>
              </>
            );
          }
          return null;
        })}
      </ul>
      <Row>
        <AnchorButton to="/login" text="Logout" />
      </Row>
    </div>
  );
}
