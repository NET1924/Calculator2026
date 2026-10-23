import { useState } from 'react';
import Calculator from './components/Calculator';
import Specification from './components/Specification';

type Page = 'calculator' | 'specification';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calculator');

  if (currentPage === 'specification') {
    return <Specification onBack={() => setCurrentPage('calculator')} />;
  }

  return <Calculator onOpenSpec={() => setCurrentPage('specification')} />;
}

export default App;
