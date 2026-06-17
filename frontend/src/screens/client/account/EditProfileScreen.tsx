import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { authService } from '../../../services/auth';
import { updateUser } from '../../../store/authSlice';
import { COLORS } from '../../../constants/colors';
import { ensureGalleryAccessAsync } from '../../../utils/imagePickerPermissions';

interface Props {
  navigation: any;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const pickPhoto = async () => {
    if (!(await ensureGalleryAccessAsync())) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    setUploadingPhoto(true);
    try {
      const updated = await authService.uploadAvatar(result.assets[0].uri);
      setAvatar(updated.avatar);
      dispatch(
        updateUser({
          avatar: updated.avatar,
          name: updated.name,
          phone: updated.phone,
        })
      );
      Alert.alert('Photo updated', 'Your profile picture was saved.');
    } catch (e: any) {
      Alert.alert('Upload failed', e.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name is required.');
      return;
    }
    if (!isAdmin && !phone.trim()) {
      Alert.alert('Required', 'Phone number is required.');
      return;
    }
    setLoading(true);
    try {
      const updated = await authService.updateProfile({
        name: name.trim(),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
      dispatch(updateUser(updated));
      Alert.alert('Saved', 'Profile updated successfully.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountScreenLayout title="Edit Profile" keyboard>
      <View style={styles.avatarBlock}>
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={pickPhoto}
          disabled={uploadingPhoto}
          activeOpacity={0.8}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color={COLORS.gray} />
            </View>
          )}
          <View style={styles.avatarBadge}>
            {uploadingPhoto ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="camera" size={14} color={COLORS.white} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to change profile photo</Text>
      </View>

      <View style={styles.form}>
        <Input label="Full name" value={name} onChangeText={setName} icon="person-outline" />
        <Input
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon="call-outline"
          placeholder={isAdmin ? 'Optional for admin' : 'Your mobile number'}
        />
        <Input
          label="Email"
          value={user?.email ?? ''}
          editable={false}
          icon="mail-outline"
        />
        <Button label="SAVE CHANGES" onPress={save} loading={loading} style={styles.btn} />
      </View>
    </AccountScreenLayout>
  );
};

const styles = StyleSheet.create({
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarHint: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  form: {
    width: '100%',
  },
  btn: { marginTop: 8 },
});
