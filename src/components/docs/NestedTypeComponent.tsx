import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, Field } from '../../types/types';
import { IconSquareDot } from '@tabler/icons-react';

type NestedTypeComponentProps = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
  handleClickDetails: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NestedTypeComponent = ({
  parentState,
  setParentState,
  handleClickType,
  handleClickDetails,
}: NestedTypeComponentProps) => {
  const { t } = useTranslation();
  const { nestedType, header, isTypeOpen } = parentState;

  let fields: Field[] | null = null;
  if (nestedType) {
    fields = nestedType.fields ? nestedType.fields : nestedType.inputFields;
  }

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    clickedType: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, clickedType);

    setParentState((prev) => ({
      ...prev,
      isTypeOpen: clickedType === 'nested' ? false : isTypeOpen,
      isNestedTypeOpen: clickedType === 'nested',
      header: nestedType ? nestedType.name : header,
    }));
  };

  const handleDetails = (event: React.MouseEvent<HTMLAnchorElement>) => {
    handleClickDetails(event);
    nestedType &&
      setParentState((prev) => ({
        ...prev,
        isTypeOpen: false,
        isNestedTypeOpen: false,
        isFieldDetailsOpen: true,
        isFieldOpen: false,
        header: nestedType.name,
      }));
  };

  return (
    nestedType && (
      <>
        <h4>{nestedType.name}</h4>
        {fields ? (
          <>
            <p className="header">
              <IconSquareDot size="1rem" stroke={2.3} /> {t('documentation.fields')}
            </p>
            {fields.map((el: Field) => (
              <div key={el.name}>
                <p>
                  <a onClick={(e) => handleDetails(e)}>{el.name}</a>:{' '}
                  {el.type.kind === 'NON_NULL' ? (
                    <span>
                      [
                      <a className="info-link" onClick={(e) => handleClick(e, 'nested')}>
                        {el.type.ofType.ofType.name}
                      </a>
                      ]!
                    </span>
                  ) : el.type.kind === 'LIST' ? (
                    <span>
                      [
                      <a className="info-link" onClick={(e) => handleClick(e, 'nested')}>
                        {el.type.ofType.name}
                      </a>
                      ]
                    </span>
                  ) : (
                    <a className="info-link" onClick={(e) => handleClick(e, 'scalar')}>
                      {el.type.name}
                    </a>
                  )}
                </p>
                <p>{el.description}</p>
              </div>
            ))}
          </>
        ) : (
          <p>{nestedType.description}</p>
        )}
      </>
    )
  );
};

export default NestedTypeComponent;
