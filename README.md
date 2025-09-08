# NSTU Mechatronics Club Registration System

A beautiful, responsive registration system for the NSTU Mechatronics Club Orientation Program with real-time dashboard and PDF generation capabilities.

## 🚀 Live Demo

**Live Application**: https://nstumechatronicsclub.web.app

## ✨ Features

### Registration System
- **Beautiful UI**: Modern glassmorphism design with neon effects and animations
- **Mobile-First**: Fully responsive design optimized for all devices
- **Real-time Validation**: Custom Student ID validation with batch exceptions
- **Duplicate Prevention**: Prevents duplicate registrations by Student ID + Session or Phone
- **Quota Management**: Configurable registration limits with real-time updates
- **Countdown Timer**: Live countdown to the orientation event

### Dashboard & Management
- **Admin Dashboard**: Secure login-protected dashboard for managing registrations
- **Real-time Updates**: Live seat count and registration status
- **Search & Filter**: Advanced filtering by department, session, and other criteria
- **PDF Export**: Generate beautiful PDF reports with all registration data
- **User Management**: Delete individual registrations with confirmation
- **Quota Control**: Set and manage registration limits

### Ticket System
- **Digital Tickets**: Generate beautiful registration tickets
- **PDF Download**: High-quality PDF tickets for printing
- **QR Code Ready**: Ticket format ready for QR code integration

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **PDF Generation**: jsPDF with custom styling
- **Icons**: Custom SVG icons and Font Awesome

## 📱 Responsive Design

- **Desktop**: Full-featured experience with all animations
- **Mobile**: Lightweight mode with optimized performance
- **Tablet**: Adaptive layout for medium screens

## 🔐 Security Features

- **Input Validation**: Comprehensive client and server-side validation
- **Authentication**: Secure admin dashboard access
- **Data Protection**: Firebase security rules for data access
- **Duplicate Prevention**: Multiple validation layers

## 🎨 Design Features

- **Neon Effects**: Beautiful glow effects and animations
- **Glassmorphism**: Modern glass-like UI elements
- **Loading Animations**: Smooth loading states and transitions
- **Color Themes**: Professional indigo/cyan color scheme
- **Typography**: Clean, readable fonts with proper hierarchy

## 📊 Student ID Validation

The system validates Student IDs with the following rules:
- Must start with: `MUH`, `ASH`, `BFK`, `BBH`, or `BKH`
- Must end with: `M` or `F`
- Must be exactly 11 characters long
- **Exception**: For session "2024-25", accepts `(batch20)` format

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/nstu-mechatronics-registration.git
   cd nstu-mechatronics-registration
   ```

2. **Set up Firebase**:
   - Create a Firebase project
   - Enable Firestore Database
   - Enable Firebase Hosting
   - Update `assets/firebase.js` with your config

3. **Deploy to Firebase**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

## 📁 Project Structure

```
├── index.html              # Main registration page
├── dashboard.html          # Admin dashboard
├── ticket.html            # Ticket display page
├── assets/
│   ├── app.js            # Main application logic
│   ├── dashboard.js      # Dashboard functionality
│   ├── ticket.js         # Ticket generation
│   └── firebase.js       # Firebase configuration
├── assets/
│   └── nstu-mc-logo.png  # Club logo
├── firebase.json         # Firebase hosting config
├── .firebaserc          # Firebase project config
└── README.md            # This file
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Firebase Hosting
4. Update the configuration in `assets/firebase.js`

### Admin Access
- Contact the system administrator for dashboard access credentials

## 📈 Performance Features

- **Lazy Loading**: Optimized asset loading
- **Caching**: Efficient data caching strategies
- **Compression**: Optimized file sizes
- **Mobile Optimization**: Lightweight mode for mobile devices

## 🎯 Event Details

- **Event**: NSTU Mechatronics Club Orientation Program
- **Venue**: IQAC
- **Time**: 2:00 PM
- **Date**: Thursday, September 11
- **Entry**: Free

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@nstumechatronicsclub.com or create an issue in this repository.

---

**Built with ❤️ for NSTU Mechatronics Club**
