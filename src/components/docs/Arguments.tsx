import { Dispatch, SetStateAction } from 'react';
import { Args, DocsState, QueryType } from '../../types/types';

type ArgumentsProps = {
  args: Args[];
  position: 'type' | 'fields';
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  query: QueryType[];
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
};

const Arguments = ({
  args,
  position,
  parentState,
  setParentState,
  query,
  handleClickType,
}: ArgumentsProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, type);
    setParentState((prev) => ({
      ...prev,
      header: parentState.field && position === 'type' ? parentState.field.name : query[0].name,
    }));
  };

  const result = args.map((item) => (
    <div key={item.name} className="argument">
      <span className="argument-name">{item.name}</span>:{' '}
      {item.type.kind === 'NON_NULL' && item.name !== 'ids' ? (
        <span>
          <a className="info-link" onClick={(e) => handleClick(e, 'scalar')}>
            {item.type.ofType.name}
          </a>
          !
        </span>
      ) : item.type.kind === 'NON_NULL' && item.name === 'ids' ? (
        <span>
          [
          <a className="info-link" onClick={(e) => handleClick(e, 'scalar')}>
            {item.type.ofType.ofType.ofType.name}
          </a>
          !]!
        </span>
      ) : item.type.kind === 'SCALAR' ? (
        <a className="info-link" onClick={(e) => handleClick(e, 'scalar')}>
          {item.type.name}
        </a>
      ) : (
        <a
          className="info-link"
          onClick={(e) => {
            handleClick(e, 'nested');
            setParentState((prev) => ({ ...prev, isNestedTypeOpen: true }));
          }}
        >
          {item.type.name}
        </a>
      )}
    </div>
  ));

  return <>{result}</>;
};

export default Arguments;
