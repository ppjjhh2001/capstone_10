import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ job }) {
  if (!job) {
    return null;
  }

  return (
    <Link to={`/jobs/${job.id}`} style={styles.cardLink}>
      <div style={styles.card}>
        <div style={styles.content}>
          <h3 style={styles.title}>{job.title}</h3>

          <p style={styles.company}>{job.company}</p>
          
          <p style={styles.address}>{job.address.split(' ').slice(0, 3).join(' ')}...</p> 
        </div>
        
        <div style={styles.footer}>
          <span style={styles.date}>{job.date || '날짜 미정'}</span>
          <span style_={styles.details}>상세보기 &rarr;</span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }
  },
  content: {
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
  },
  company: {
    fontSize: '1rem',
    color: '#555',
    margin: '0 0 0.5rem 0',
  },
  address: {
    fontSize: '0.9rem',
    color: '#777',
    margin: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  date: {
    fontSize: '0.9rem',
    color: '#888',
  },
  details: {
    fontSize: '0.9rem',
    color: '#007bff',
    fontWeight: 'bold',
  }
};

export default JobCard;