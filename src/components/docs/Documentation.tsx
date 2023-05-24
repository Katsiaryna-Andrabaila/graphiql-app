import { useState } from 'react';
import { DocsState, Field, QueryType } from '../../types/types';
import InitialComponent from './InitialComponent';
import FieldsComponent from './FieldsComponent';
import CurrentField from './CurrentField';
import TypeComponent from './TypeComponent';
import NestedTypeComponent from './NestedTypeComponent';
import FieldDetailsComponent from './FieldDetailsComponent';

const initialState: DocsState = {
  isQueryOpen: false,
  isFieldOpen: false,
  field: null,
  header: 'Docs',
  type: null,
  isTypeOpen: false,
  nestedType: null,
  isNestedTypeOpen: false,
  scalarType: null,
  fieldDetails: null,
  isFieldDetailsOpen: false,
};

const Documentation = ({ query }: { query: QueryType[] }) => {
  const [state, setState] = useState<DocsState>(initialState);
  const {
    isQueryOpen,
    isFieldOpen,
    field,
    header,
    type,
    isTypeOpen,
    nestedType,
    isNestedTypeOpen,
    scalarType,
    fieldDetails,
    isFieldDetailsOpen,
  } = state;

  const handleClickHeader = () => {
    switch (header) {
      case 'Docs':
        setState((prev) => ({
          ...prev,
          isQueryOpen: false,
          isFieldOpen: false,
          isTypeOpen: false,
          isNestedTypeOpen: false,
          isFieldDetailsOpen: false,
        }));
        break;
      case query[0].name:
        setState((prev) => ({
          ...prev,
          isQueryOpen: true,
          isFieldOpen: false,
          isTypeOpen: false,
          isNestedTypeOpen: false,
          type: null,
          nestedType: null,
          scalarType: null,
          header: 'Docs',
        }));
        break;
      case field?.name:
        setState((prev) => ({
          ...prev,
          isQueryOpen: false,
          isFieldOpen: true,
          isTypeOpen: false,
          scalarType: null,
          nestedType: null,
          header: query[0].name,
        }));
        break;
      case type?.name:
        setState((prev) => ({
          ...prev,
          isFieldOpen: false,
          isTypeOpen: true,
          isNestedTypeOpen: false,
          fieldDetails: null,
          scalarType: null,
          header: field ? field.name : query[0].name,
        }));
        break;
      case nestedType?.name:
        setState((prev) => ({
          ...prev,
          isTypeOpen: false,
          isNestedTypeOpen: true,
          fieldDetails: null,
          scalarType: null,
          header: type ? type.name : query[0].name,
        }));
        break;
      case fieldDetails?.name:
        setState((prev) => ({
          ...prev,
          isTypeOpen: false,
          isNestedTypeOpen: false,
          isFieldDetailsOpen: true,
          isFieldOpen: false,
          scalarType: null,
          header: nestedType ? nestedType.name : type!.name,
        }));
        break;
      case scalarType?.name:
        setState((prev) => ({
          ...prev,
          scalarType: null,
          header: fieldDetails ? fieldDetails.name : nestedType!.name,
        }));
        break;
    }
  };

  const handleClickField = (clickedType: Field) => {
    if (isFieldOpen) {
      setState((prev) => ({ ...prev, isFieldOpen: false, isQueryOpen: true }));
    } else {
      setState((prev) => ({
        ...prev,
        isFieldOpen: true,
        isQueryOpen: false,
        field: clickedType,
        header: query[0].name,
      }));
    }
  };

  const handleClickType = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => {
    if (event.target instanceof HTMLAnchorElement) {
      const value = event.target.innerText;
      const targetType = query.find((el) => el.name === value);
      if (targetType) {
        switch (type) {
          case 'type':
            setState((prev) => ({ ...prev, type: targetType }));
            break;
          case 'nested':
            setState((prev) => ({ ...prev, nestedType: targetType }));
            break;
          case 'scalar':
            setState((prev) => ({ ...prev, scalarType: targetType }));
            break;
        }
      }
      setState((prev) => ({ ...prev, isQueryOpen: false, isFieldOpen: false }));
    }
  };

  const handleClickDetails = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.target instanceof HTMLAnchorElement) {
      const value = event.target.innerText;

      if (type) {
        const details = type.inputFields
          ? type.inputFields.find((el) => el.name === value)
          : type.fields.find((el) => el.name === value);
        details && setState((prev) => ({ ...prev, fieldDetails: details }));
        return;
      }
      if (nestedType) {
        const details = nestedType.inputFields
          ? nestedType.inputFields.find((el) => el.name === value)
          : nestedType.fields.find((el) => el.name === value);
        details && setState((prev) => ({ ...prev, fieldDetails: details }));
      }
    }
  };

  const docsOpen =
    !isQueryOpen &&
    !isFieldOpen &&
    !isTypeOpen &&
    !isNestedTypeOpen &&
    !scalarType &&
    !isFieldDetailsOpen;
  console.log(fieldDetails, type);
  return (
    <>
      {docsOpen ? (
        <InitialComponent parentState={state} setParentState={setState} query={query} />
      ) : (
        <>
          <a onClick={handleClickHeader}>{`< ${header}`}</a>
        </>
      )}

      {isQueryOpen && (
        <FieldsComponent
          parentState={state}
          setParentState={setState}
          query={query}
          handleClickType={handleClickType}
          handleClickField={handleClickField}
        />
      )}

      {isFieldOpen && (
        <CurrentField
          parentState={state}
          setParentState={setState}
          query={query}
          handleClickType={handleClickType}
        />
      )}

      {isTypeOpen && (
        <TypeComponent
          parentState={state}
          setParentState={setState}
          handleClickType={handleClickType}
          handleClickDetails={handleClickDetails}
        />
      )}

      {isNestedTypeOpen && (
        <NestedTypeComponent
          parentState={state}
          setParentState={setState}
          handleClickType={handleClickType}
          handleClickDetails={handleClickDetails}
        />
      )}

      {isFieldDetailsOpen && (
        <FieldDetailsComponent
          parentState={state}
          setParentState={setState}
          handleClickType={handleClickType}
        />
      )}

      {scalarType && (
        <>
          <h4>{scalarType.name}</h4>
          {<p>{scalarType.description}</p>}
        </>
      )}
    </>
  );
};

export default Documentation;
