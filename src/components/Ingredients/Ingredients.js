import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/useHttp';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {httpState, sendRequest} = useHttp();
  const {error, loading, action} = httpState;

  useEffect(() => {
    action && dispatch(action);
  }, [action]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const searchIngredientsHandler = useCallback(query => {
    sendRequest(
      'https://react-personal-practice-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json' + query, {
        method: 'GET',
        setAction: 'SET_INGREDIENTS',
      }
    );
  }, [sendRequest]);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-personal-practice-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json', {
        method: 'POST',
        body: ingredient,
        setAction: 'ADD_INGREDIENT'
      }
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `https://react-personal-practice-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
        method: 'DELETE',
        setAction: 'DELETE_INGREDIENT',
        actionData: { id: ingredientId }
      }
    );
  }, [sendRequest]);

  const clearError = useCallback(() => {
    sendRequest(null, { method: 'CLEAR ERROR' });
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && (
        <ErrorModal onClose={clearError}>{error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onSearchIngredient={searchIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
