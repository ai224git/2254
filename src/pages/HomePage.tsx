import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import FormationTable from '../components/FormationTable';
import { getFormations } from '../lib/supabase';

const HomePage: React.FC = () => {
  const [formations, setFormations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [filters, setFilters] = useState({
    search: '',
    type: [], // Empty array by default
    departement: '',
    ville: '',
  });
  
  useEffect(() => {
    fetchFormations();
  }, [currentPage, filters, sortColumn, sortDirection]);
  
  const fetchFormations = async () => {
    setIsLoading(true);
    try {
      const { data, count } = await getFormations(
        currentPage, 
        500, 
        filters,
        sortColumn,
        sortDirection
      );
      setFormations(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching formations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    
    // Reset to page 1 when sorting changes
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Évaluez vos chances sur Parcoursup
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Notre outil vous aide à estimer votre chance d'obtenir une place dans une formation sur Parcoursup 
            en auto-évaluant votre dossier grâce à une moyenne des notes principalement attendues par la filière.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Comment ça fonctionne ?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Sélectionnez une formation qui vous intéresse dans le tableau ci-dessous</li>
                    <li>Consultez la note sur 20 de la formation choisie</li>
                    <li>Comparez avec votre moyenne (calculée avec les matières attendues dans cette filière)</li>
                  </ol>
                  <p className="mt-2">
                    Afin de mieux évaluer le recrutement de la formation vous pouvez consulter notre page Conseils
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Formations</h2>
        <FormationTable 
          formations={formations}
          isLoading={isLoading}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </section>
    </main>
  );
};

export default HomePage;