import { useReducer, useCallback } from "react";

const httpReducer = (curHttpState, {type, errorMessage, dispatch}) => {
  switch (type) {
    case 'SEND':
      return { loading: true, error: null, action: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false, action: dispatch };
    case 'ERROR':
      return { loading: false, error: errorMessage, action: null };
    case 'CLEAR':
      return { ...curHttpState, error: null, action: null };
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    action: null
  });

  const sendRequest = useCallback((url, {method, body, setAction, actionData}) => {
    switch (method) {
      case 'CLEAR ERROR':
        dispatchHttp({ type: 'CLEAR'});
        break;
      default:
        dispatchHttp({ type: 'SEND' });
        fetch(url, {
          method: method,
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("HTTP status: " + response.status);
          }
          return response.json();
        })
        .then(responseData => {
          let action = null;
          switch (setAction) {
            case 'SET_INGREDIENTS':
              action = { type: 'SET', ingredients: Object.entries(responseData).map(entry => ({ id: entry[0], ...entry[1] }))};
              break;
            case 'ADD_INGREDIENT':
              action = { type: 'ADD', ingredient: { id: responseData.name, ...body }};
              break;
            case 'DELETE_INGREDIENT':
              action = { type: 'DELETE', id: actionData.id };
              break;
            default:
              action = null;
          }
          dispatchHttp({ type: 'RESPONSE', dispatch: action });
        })
        .catch(error => {
          console.log(error);
          dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
        });
    }
  }, []);

  return {
    httpState: httpState,
    sendRequest: sendRequest
  };
};

export default useHttp