import { Field } from '../types/types';

export const Schema = ({ fields }: { fields: Field[] }) => {
  return (
    <div className="schema">
      {fields.map((el: Field, i) => (
        <div key={i}>{el.name}</div>
      ))}
    </div>
  );
};
