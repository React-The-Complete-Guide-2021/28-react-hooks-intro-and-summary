import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    setUserIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient }
    ]);
  };

  const removeIngredient = id => {
    setUserIngredients(prevIngredients => {
      for (let i = 0; i < prevIngredients.length; i++) {
        if (prevIngredients[i].id === id) {
          prevIngredients.splice(i, 1);
          setUserIngredients(prevIngredients);
          break;
        }
      }
    });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
};

export default Ingredients;
