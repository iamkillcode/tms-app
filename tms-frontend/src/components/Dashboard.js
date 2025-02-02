import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeTenders: 0,
    completedTenders: 0,
    pendingISOs: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const chartRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleGenerateTenderNumber = () => {
    // Logic to generate tender number
    toast.success('Tender number generated successfully!');
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to access the dashboard');
      navigate('/login', { replace: true });
    }

    // Simulated data - replace with actual API calls
    setStats({
      totalTenders: 156,
      activeTenders: 45,
      completedTenders: 98,
      pendingISOs: 13,
    });

    setRecentActivities([
      { id: 1, action: 'ISO-2023-089 created for Tender #T789', timestamp: '2 minutes ago' },
      { id: 2, action: 'New tender #T790 submitted', timestamp: '1 hour ago' },
      { id: 3, action: 'Tender #T785 marked as completed', timestamp: '3 hours ago' },
    ]);

    const ctx = document.getElementById('tenderChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Tenders Created',
          data: [12, 19, 15, 25, 22, 30],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }, {
          label: 'ISOs Generated',
          data: [8, 15, 12, 20, 18, 25],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Tender & ISO Monthly Analysis' }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.name}!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <AssignmentIcon />
              <Typography variant="h5">{stats.totalTenders}</Typography>
              <Typography color="textSecondary">Total Tenders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <TimelineIcon />
              <Typography variant="h5">{stats.activeTenders}</Typography>
              <Typography color="textSecondary">Active Tenders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <PendingActionsIcon />
              <Typography variant="h5">{stats.pendingISOs}</Typography>
              <Typography color="textSecondary">Pending ISOs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8eaf6' }}>
            <CardContent>
              <CheckCircleIcon />
              <Typography variant="h5">{stats.completedTenders}</Typography>
              <Typography color="textSecondary">Completed Tenders</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Tender Analytics</Typography>
            <canvas id="tenderChart" height="300"></canvas>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.timestamp}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;