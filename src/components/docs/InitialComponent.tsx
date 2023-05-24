import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, QueryType } from '../../types/types';

type Props = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  query: QueryType[];
};

const InitialComponent = ({ parentState, setParentState, query }: Props) => {
  const { isQueryOpen } = parentState;
  const { t } = useTranslation();

  return (
    <>
      <h3>{t('documentation.docs')}</h3>
      <p>{t('documentation.docsDescription')}</p>
      <p>{`~ ${t('documentation.rootTypes')}`}</p>
      <p>
        query:{' '}
        <a onClick={() => setParentState((prev) => ({ ...prev, isQueryOpen: !isQueryOpen }))}>
          {query[0].name}
        </a>
      </p>
    </>
  );
};

export default InitialComponent;
