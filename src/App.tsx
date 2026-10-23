import { useState } from 'react';
import Calculator from './components/Calculator';
import Specification from './components/Specification';
import UnitConverter from './components/UnitConverter';

type Page = 'calculator' | 'specification' | 'converter';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calculator');

  if (currentPage === 'specification') {
    return <Specification onBack={() => setCurrentPage('calculator')} />;
  }

  if (currentPage === 'converter') {
    return (
      <UnitConverter
        onBack={() => setCurrentPage('calculator')}
        onOpenSpec={() => setCurrentPage('specification')}
      />
    );
  }

  return (
    <Calculator
      onOpenSpec={() => setCurrentPage('specification')}
      onOpenConverter={() => setCurrentPage('converter')}
    />
  );
}

export default App;
