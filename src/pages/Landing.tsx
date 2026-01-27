import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Clock, MapPin, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { buses, routes, schedules } from '@/data/dummyData';

const Landing = () => {
  const features = [
    {
      icon: <Bus className="w-6 h-6" />,
      title: '16+ Buses',
      description: 'Large fleet of comfortable buses serving the CUET community',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Multiple Routes',
      description: 'Various routes connecting CUET to major city locations',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Schedules',
      description: 'Morning and evening departures to fit your timetable',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Safe & Reliable',
      description: 'Experienced drivers and well-maintained vehicles',
    },
  ];

  const categories = [
    { name: 'Students', description: 'Dedicated buses for student commute', color: 'bg-student' },
    { name: 'Teachers', description: 'Comfortable travel for faculty members', color: 'bg-teacher' },
    { name: 'Staff', description: 'Reliable transport for university staff', color: 'bg-staff' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">CUET Bus</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Serving CUET since 2010
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Reliable Campus
            <br />
            <span className="text-primary">Transportation Solution</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            CUET Transport Section provides seamless bus scheduling and tracking 
            for students, teachers, and staff of Chittagong University of Engineering & Technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2 h-12 px-6">
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="h-12 px-6">
                View Schedules
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{buses.length}</p>
              <p className="text-sm text-muted-foreground">Buses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{routes.length}</p>
              <p className="text-sm text-muted-foreground">Routes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{schedules.length}</p>
              <p className="text-sm text-muted-foreground">Daily Trips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose CUET Bus?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We provide safe, reliable, and comfortable transportation for the entire CUET community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Serving Everyone at CUET
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Dedicated bus services for all members of the university community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-soft overflow-hidden group hover:shadow-card transition-all hover:-translate-y-1">
                <div className={`h-2 ${category.color}`} />
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${category.color}/10 flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                    <Users className={`w-8 h-8 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-0 shadow-soft gradient-primary overflow-hidden">
            <CardContent className="p-12 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
                Sign up now to view bus schedules, check routes, and never miss your ride again.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Create Your Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CUET Transport Section</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Chittagong University of Engineering & Technology. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
