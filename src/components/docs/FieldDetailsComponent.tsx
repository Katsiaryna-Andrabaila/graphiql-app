import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState } from '../../types/types';

type Props = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
};

const FieldDetailsComponent = ({ parentState, setParentState, handleClickType }: Props) => {
  const { t } = useTranslation();
  const { fieldDetails } = parentState;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    clickedType: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, clickedType);
    fieldDetails &&
      setParentState((prev) => ({
        ...prev,
        isFieldDetailsOpen: false,
        header: fieldDetails.name,
      }));
  };

  return (
    fieldDetails && (
      <>
        <h4>{fieldDetails.name}</h4>
        {fieldDetails.description && <p>{fieldDetails.description}</p>}
        <p>{`▪ ${t('documentation.type')}`}</p>
        {fieldDetails.type.kind === 'NON_NULL' ? (
          <span>
            [
            <a
              onClick={(e) => {
                handleClick(e, 'type');
                setParentState((prev) => ({
                  ...prev,
                  isTypeOpen: true,
                }));
              }}
            >
              {fieldDetails.type.ofType.ofType.name}
            </a>
            ]!
          </span>
        ) : fieldDetails.type.kind === 'LIST' ? (
          <span>
            [
            <a
              onClick={(e) => {
                handleClick(e, 'nested');
                setParentState((prev) => ({
                  ...prev,
                  isNestedTypeOpen: true,
                }));
              }}
            >
              {fieldDetails.type.ofType.name}
            </a>
            ]
          </span>
        ) : fieldDetails.type.kind === 'OBJECT' ? (
          <a
            onClick={(e) => {
              handleClick(e, 'nested');
              setParentState((prev) => ({
                ...prev,
                isNestedTypeOpen: true,
              }));
            }}
          >
            {fieldDetails.type.name}
          </a>
        ) : (
          <a onClick={(e) => handleClick(e, 'scalar')}>{fieldDetails.type.name}</a>
        )}
      </>
    )
  );
};

export default FieldDetailsComponent;
