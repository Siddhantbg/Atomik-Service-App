import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { MasterJobAssignPanel } from '../../components/technician/MasterJobAssignPanel';
import { bookingService, Booking } from '../../services/bookings';
import { authService, AuthUser } from '../../services/auth';
import { COLORS } from '../../constants/colors';
import { formatBookingSchedule } from '../../utils/schedule';
import { resolveAssignedTechnicianId } from '../../utils/technicianBooking';

interface Props {
  navigation: any;
}

export const MasterAssignScreen: React.FC<Props> = () => {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const allJobs = await bookingService.getMyBookings({ limit: 100 });
      let techs: AuthUser[] = [];
      try {
        techs = await authService.listTechnicians();
      } catch {
        techs = [];
      }
      setJobs(
        allJobs.filter(
          (j) => !resolveAssignedTechnicianId(j) && j.status !== 'cancelled'
        )
      );
      setTechnicians(techs);
    } catch {
      setJobs([]);
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingView />;

  return (
    <Screen>
      <Header showBack title="Assign Jobs" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Assign open jobs using the technician dropdown, or accept a job yourself.
          Jobs you assign cannot be dropped by the technician without contacting you.
        </Text>

        {jobs.length === 0 ? (
          <Card padding={16}>
            <Text style={styles.empty}>No open jobs waiting for assignment.</Text>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job._id} padding={16} style={styles.jobCard}>
              <Text style={styles.jobId}>#{job.bookingId}</Text>
              <Text style={styles.jobMeta}>{job.serviceType}</Text>
              <Text style={styles.jobMeta}>{job.venueId?.name ?? 'Venue'}</Text>
              <Text style={styles.jobMeta}>
                {formatBookingSchedule(job.scheduledDate, job.scheduledTime)}
              </Text>

              <MasterJobAssignPanel
                job={job}
                technicians={technicians}
                onUpdated={load}
                showHint={false}
              />

              {technicians.length === 0 ? (
                <Text style={styles.warn}>No technician accounts found.</Text>
              ) : null}
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  intro: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  empty: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
  jobCard: { marginBottom: 12 },
  jobId: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 4,
  },
  jobMeta: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
  },
  warn: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.statusPending,
    marginTop: 8,
  },
});
