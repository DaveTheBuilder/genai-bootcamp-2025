import React from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { ModelDetails } from '@/components/analysis/ModelDetails';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const ModelDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        {id && <ModelDetails modelId={Number(id)} />}
      </div>
    </DashboardLayout>
  );
};

export default ModelDetailsPage;
