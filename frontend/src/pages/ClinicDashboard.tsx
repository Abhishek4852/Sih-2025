import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/AuthContext';
import { mockHealthReports, getVillageById } from '@/lib/mockData';
import { toast } from 'sonner';

const ClinicDashboard = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('weekly');

  // Mock clinic reports (in real app, this would be fetched based on clinic_id)
  const clinicReports = mockHealthReports.slice(0, 3); // Sample reports for demo

  const handleSendAlert = (type: 'water' | 'disease') => {
    toast.success(`${type === 'water' ? 'Water contamination' : 'Disease'} alert sent to concerned authorities!`);
  };

  const getWeeklyReportData = () => {
    return clinicReports.map((report, index) => ({
      date: report.date_of_reporting,
      disease: report.symptoms.split(', ')[0], // First symptom as primary disease
      cases: Math.floor(Math.random() * 10) + 1, // Mock case count
      village: getVillageById(report.village_id)?.village_name || 'Unknown'
    }));
  };

  const getMonthlyReportSummary = () => {
    const totalCases = clinicReports.length * 5; // Mock total
    const diseaseBreakdown = {
      'Typhoid': Math.floor(totalCases * 0.3),
      'Fever': Math.floor(totalCases * 0.4),
      'Diarrhea': Math.floor(totalCases * 0.2),
      'Others': Math.floor(totalCases * 0.1)
    };

    return {
      totalCases,
      diseaseBreakdown
    };
  };

  const weeklyData = getWeeklyReportData();
  const monthlyData = getMonthlyReportSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowProfile(true)}
                className="text-left"
              >
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-sm text-gray-600">Clinic Dashboard</p>
                </div>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Marquee */}
      <div className="bg-orange-600 text-white py-2 overflow-hidden">
        <div className="animate-pulse">
          <marquee className="text-sm">
            📢 HEALTH ALERT: Increased cases of waterborne diseases reported in the region.
            Enhanced hygiene protocols recommended. Water contamination detected in multiple sources.
          </marquee>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  View clinic reports and patient data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <Button
                    variant={reportPeriod === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setReportPeriod('weekly')}
                  >
                    Weekly Report
                  </Button>
                  <Button
                    variant={reportPeriod === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setReportPeriod('monthly')}
                  >
                    Monthly Report
                  </Button>
                </div>

                {/* Weekly Report Table */}
                {reportPeriod === 'weekly' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Weekly Report Data</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Disease</TableHead>
                            <TableHead>Cases</TableHead>
                            <TableHead>Village</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {weeklyData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="font-medium">{item.disease}</TableCell>
                              <TableCell>{item.cases}</TableCell>
                              <TableCell>{item.village}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Monthly Report Summary */}
                {reportPeriod === 'monthly' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Report Summary</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        <strong>Total Cases This Month:</strong> {monthlyData.totalCases}
                      </p>

                      <h4 className="font-semibold mb-3">Disease-wise Breakdown:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(monthlyData.diseaseBreakdown).map(([disease, count]) => (
                          <div key={disease} className="flex justify-between p-3 bg-white rounded border">
                            <span>{disease}:</span>
                            <span className="font-bold">{count} cases</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-gray-600 mt-4 text-sm">
                        The clinic has observed a significant increase in waterborne diseases this month.
                        Typhoid and fever cases are particularly high, suggesting potential water contamination issues.
                        Immediate attention to water quality and sanitation measures is recommended.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Total Patients</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">142</div>
                    <div className="text-sm text-gray-600">Recovered</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">Under Treatment</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-600">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Alert Section */}
          <div className="space-y-6">
            {/* Alert Section */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Section</CardTitle>
                <CardDescription>
                  Send alerts to notify concerned authorities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleSendAlert('water')}
                >
                  🚰 Water Contamination Alert
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleSendAlert('disease')}
                >
                  🦠 Disease Alert
                </Button>

                <div className="text-xs text-gray-500 mt-4">
                  <p><strong>Water Contamination Alert:</strong> Triggers when water quality issues are detected</p>
                  <p><strong>Disease Alert:</strong> Triggers when disease cases exceed normal thresholds</p>
                </div>
              </CardContent>
            </Card>

            {/* Clinic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{getVillageById(user?.village_id || 0)?.village_name || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Established:</span>
                  <span className="font-medium">2019</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff Count:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Bed Capacity:</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Services:</span>
                  <span className="font-medium text-green-600">Available 24/7</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Patient admitted with severe symptoms</p>
                      <p className="text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Weekly report submitted</p>
                      <p className="text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Water contamination alert sent</p>
                      <p className="text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Health camp organized</p>
                      <p className="text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clinic Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Clinic Name</label>
              <p className="text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location/Village</label>
              <p>{getVillageById(user?.village_id || 0)?.village_name || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p>{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Registration Date</label>
              <p>{user?.created_at}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Duration of Working</label>
              <p>5 years 2 months</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">License Number</label>
              <p>CL-NER-2019-{user?.user_id?.toString().padStart(4, '0')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Specialization</label>
              <p>General Medicine, Emergency Care</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicDashboard;
