require_relative '../spec_helper'

describe process 'apache2'  do
  it { should be_running }
end

describe package 'apache2-mpm-prefork' do
  it { should be_installed }
end

describe package('php5') do
  it { should be_installed }
end

describe package('libapache2-mod-php5') do
  it { should be_installed }
end

describe file '/etc/apache2/sites-available/dash-prod' do
  its (:content) { should match /DocumentRoot \/opt\/dash\/public/ }
  its (:content) { should match /SetEnv APPLICATION_ENV "production"/ }
end

