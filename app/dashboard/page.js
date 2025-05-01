'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // green, amber, red

const STATUS_COLORS = {
  read: 'text-green-600 bg-green-100',
  unread: 'text-yellow-600 bg-yellow-100',
  archived: 'text-red-600 bg-red-100',
};

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CONTACT_FORM_SUBMISSION_ENDPOINT}/api/submissions`, {
          headers: {
            'X-API-Key': process.env.NEXT_PUBLIC_CONTACT_FORM_SUBMISSION_API_KEY,
          },
        });
        const data = await res.json();
        setSubmissions(data.results || []);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  const statusData = submissions.reduce((acc, s) => {
    const status = s.status || 'unread';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusData).map((key) => ({
    name: key,
    value: statusData[key],
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">📬 Contact Submissions</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[s.status] || 'text-gray-500 bg-gray-100'}`}>{s.status || 'unread'}</span>
              </div>
              <p className="mt-2 text-gray-700">{s.message}</p>
              <p className="text-xs text-gray-400 mt-1">Submitted at: {new Date(s.submitted_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">📊 Status Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
