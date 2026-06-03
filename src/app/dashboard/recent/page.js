"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Clock, Calendar, Image as ImageIcon, FolderOpen, Sparkles, RefreshCw } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function RecentPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [history, setHistory] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState(30); // days

    useEffect(() => {
        if (user) {
            fetchRecentData();
        }
    }, [user, timeFilter]);

    const fetchRecentData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');

            const [historyResponse, projectsResponse] = await Promise.all([
                apiService.getRecentHistory(token, { days: timeFilter }),
                apiService.getRecentProjects(token, { days: timeFilter })
            ]);

            setHistory(historyResponse.history || []);
            setProjects(projectsResponse.projects || []);
        } catch (err) {
            console.error('Error fetching recent data:', err);
            setError('Failed to load recent activity');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    };

    const formatDetailedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getImageTypeIcon = (imageType) => {
        switch (imageType) {
            case 'white_background':
                return <ImageIcon className="w-4 h-4 text-gold-solid" />;
            case 'model_with_ornament':
            case 'real_model_with_ornament':
                return <Sparkles className="w-4 h-4 text-gold-solid" />;
            case 'campaign_shot_advanced':
                return <ImageIcon className="w-4 h-4 text-green-500" />;
            case 'background_change':
                return <RefreshCw className="w-4 h-4 text-orange-500" />;
            // Project-based image types
            case 'project_white_background':
                return <ImageIcon className="w-4 h-4 text-gold-solid" />;
            case 'project_background_replace':
                return <RefreshCw className="w-4 h-4 text-orange-600" />;
            case 'project_model_image':
            case 'project_ai_model_generation':
                return <Sparkles className="w-4 h-4 text-gold-solid" />;
            case 'project_campaign_image':
                return <ImageIcon className="w-4 h-4 text-green-600" />;
            case 'project_model_selection':
                return <Sparkles className="w-4 h-4 text-gold-solid" />;
            case 'project_product_upload':
                return <ImageIcon className="w-4 h-4 text-cyan-500" />;
            default:
                return <ImageIcon className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getImageTypeLabel = (imageType) => {
        switch (imageType) {
            case 'white_background':
                return 'White Background';
            case 'model_with_ornament':
                return 'AI Model';
            case 'real_model_with_ornament':
                return 'Real Model';
            case 'campaign_shot_advanced':
                return 'Campaign Shot';
            case 'background_change':
                return 'Background Change';
            // Project-based image types
            case 'project_white_background':
                return 'Project: White Background';
            case 'project_background_replace':
                return 'Project: Background Replace';
            case 'project_model_image':
                return 'Project: Model Image';
            case 'project_campaign_image':
                return 'Project: Campaign Image';
            case 'project_ai_model_generation':
                return 'Project: AI Model Generated';
            case 'project_model_selection':
                return 'Project: Model Selected';
            case 'project_product_upload':
                return 'Project: Product Uploaded';
            default:
                return imageType.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    const filteredHistory = history.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'projects') return item.type === 'project_image';
        if (activeTab === 'images') return item.type === 'individual_image';
        return false;
    });

    if (loading) {
        return (
            <div className="min-h-[50vh] p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-solid"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[50vh] p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchRecentData}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-8 h-8 text-gold-solid" />
                        <h1 className="text-3xl font-bold text-foreground">Recent Activity</h1>
                    </div>
                    <p className="text-muted-foreground">Track your recent image generation and project activity</p>
                </div>

                {/* Time Filter */}
                <div className="mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Show activity from:</span>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(Number(e.target.value))}
                            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                        >
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-secondary p-1 rounded-lg w-fit">
                        {[
                            { id: 'all', label: 'All Activity', count: history.length },
                            { id: 'projects', label: 'Projects', count: history.filter(h => h.type === 'project_image').length },
                            { id: 'images', label: 'Images', count: history.filter(h => h.type === 'individual_image').length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-card text-gold-solid shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Activity Feed */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {filteredHistory.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <p>No recent activity found</p>
                                        <p className="text-sm">Start creating images to see your activity here</p>
                                    </div>
                                ) : (
                                    filteredHistory.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-muted transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                                                        {getImageTypeIcon(item.image_type)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {getImageTypeLabel(item.image_type)}
                                                        </span>
                                                        {item.parent_image_id && (
                                                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                                                Regenerated
                                                            </span>
                                                        )}
                                                        {item.project && (
                                                            <span className="px-2 py-1 text-xs bg-accent text-foreground rounded-full">
                                                                {item.project.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                        {item.prompt || 'No prompt available'}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1" title={formatDetailedDate(item.created_at)}>
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(item.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image_url}
                                                        alt="Generated content"
                                                        className="w-16 h-16 object-cover rounded-lg border border-border"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Projects Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Projects */}
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <FolderOpen className="w-5 h-5 text-gold-solid" />
                                    Recent Projects
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {projects.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        <FolderOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm">No recent projects</p>
                                    </div>
                                ) : (
                                    projects.map((project) => (
                                        <div key={project.id} className="p-4 hover:bg-muted transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-foreground line-clamp-1">
                                                    {project.name}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            {project.about && (
                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                    {project.about}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{project.total_images} images</span>
                                                <span title={formatDetailedDate(project.updated_at)}>{formatDate(project.updated_at)}</span>
                                            </div>
                                            {project.recent_activity.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-border">
                                                    <p className="text-xs text-muted-foreground mb-2">Recent activity:</p>
                                                    <div className="space-y-2">
                                                        {project.recent_activity.slice(0, 2).map((activity) => (
                                                            <div key={activity.id} className="flex items-center gap-2">
                                                                <img
                                                                    src={activity.image_url}
                                                                    alt="Recent activity"
                                                                    className="w-6 h-6 object-cover rounded border border-border"
                                                                    onError={(e) => {
                                                                        e.target.src = '/placeholder-image.png';
                                                                    }}
                                                                />
                                                                <span className="text-xs text-muted-foreground line-clamp-1">
                                                                    {getImageTypeLabel(activity.image_type)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total Images</span>
                                    <span className="font-semibold text-foreground">{history.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Active Projects</span>
                                    <span className="font-semibold text-foreground">
                                        {projects.filter(p => p.status === 'progress').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Regenerated</span>
                                    <span className="font-semibold text-foreground">
                                        {history.filter(h => h.parent_image_id).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
