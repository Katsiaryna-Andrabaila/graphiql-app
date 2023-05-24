import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, Field } from '../../types/types';

type Props = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
  handleClickDetails: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const TypeComponent = ({
  parentState,
  setParentState,
  handleClickType,
  handleClickDetails,
}: Props) => {
  const { t } = useTranslation();
  const { type } = parentState;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    clickedType: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, clickedType);
    type &&
      setParentState((prev) => ({
        ...prev,
        isTypeOpen: false,
        isNestedTypeOpen: true,
        header: type.name,
      }));
  };

  const handleDetails = (event: React.MouseEvent<HTMLAnchorElement>) => {
    handleClickDetails(event);
    type &&
      setParentState((prev) => ({
        ...prev,
        isTypeOpen: false,
        isNestedTypeOpen: false,
        isFieldDetailsOpen: true,
        header: type.name,
      }));
  };

  return (
    type && (
      <>
        <h4>{type.name}</h4>
        {type.fields ? (
          <>
            <p>{`▪ ${t('documentation.fields')}`}</p>
            {type.fields.map((el: Field) => (
              <div key={el.name}>
                <p>
                  <a onClick={(e) => handleDetails(e)}>{el.name}</a>:{' '}
                  {el.type.kind === 'NON_NULL' ? (
                    <span>
                      [<a onClick={(e) => handleClick(e, 'nested')}>{el.type.ofType.ofType.name}</a>
                      ]!
                    </span>
                  ) : el.type.kind === 'LIST' ? (
                    <span>
                      [<a onClick={(e) => handleClick(e, 'nested')}>{el.type.ofType.name}</a>]
                    </span>
                  ) : (
                    <a onClick={(e) => handleClick(e, 'nested')}>{el.type.name}</a>
                  )}
                </p>
                <p>{el.description}</p>
              </div>
            ))}
          </>
        ) : (
          <p>{type.description}</p>
        )}
      </>
    )
  );
};

export default TypeComponent;
