import { useState } from 'react';
import Calculator from './components/Calculator';
import Specification from './components/Specification';
import UnitConverter from './components/UnitConverter';
import ComplexNumbers from './components/ComplexNumbers';
import FunctionGraph from './components/FunctionGraph';

type Page = 'calculator' | 'specification' | 'converter' | 'complex' | 'graph';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calculator');

  if (currentPage === 'specification') {
    return <Specification onBack={() => setCurrentPage('calculator')} />;
  }

  if (currentPage === 'converter') {
    return <UnitConverter onBack={() => setCurrentPage('calculator')} />;
  }

  if (currentPage === 'complex') {
    return <ComplexNumbers onBack={() => setCurrentPage('calculator')} />;
  }

  if (currentPage === 'graph') {
    return <FunctionGraph onBack={() => setCurrentPage('calculator')} />;
  }

  return (
    <Calculator
      onOpenSpec={() => setCurrentPage('specification')}
      onOpenConverter={() => setCurrentPage('converter')}
      onOpenComplex={() => setCurrentPage('complex')}
      onOpenGraph={() => setCurrentPage('graph')}
    />
  );
}
