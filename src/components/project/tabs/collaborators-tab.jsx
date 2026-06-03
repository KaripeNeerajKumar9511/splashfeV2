"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    UserPlus,
    Users,
    Mail,
    Crown,
    Edit3,
    Eye,
    MoreVertical,
    Star,
    Loader2,
    CheckCircle,
    Trash2,
    Calendar,
} from "lucide-react"
import InviteModal from "@/components/project/InviteModal"
import { apiService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function CollaborationPage({ projectId, projectData }) {
    const { token, user } = useAuth()
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteLoading, setInviteLoading] = useState(false)
    const [teamMembers, setTeamMembers] = useState([])
    const [pendingInvites, setPendingInvites] = useState([])
    const [loading, setLoading] = useState(true)
    const [successMessage, setSuccessMessage] = useState("")
    const [roleChangeLoading, setRoleChangeLoading] = useState(null)
    const [memberDeleteLoading, setMemberDeleteLoading] = useState(null)
    const [inviteActionLoading, setInviteActionLoading] = useState(null)

    useEffect(() => {
        if (projectId) {
            fetchProjectData()
            fetchPendingInvites()
        }
    }, [projectId])

    const fetchProjectData = async () => {
        try {
            setLoading(true)
            const data = await apiService.getProject(projectId, token)
            setTeamMembers(data.team_members || [])
        } catch (err) {
            console.error("Error fetching project data:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchPendingInvites = async () => {
        try {
            const data = await apiService.listInvites(projectId, token)
            setPendingInvites(data.pending_invites || [])
        } catch (err) {
            console.error("Error fetching invites:", err)
        }
    }

    const handleInvite = async (email, role) => {
        setInviteLoading(true)
        setSuccessMessage("")
        try {
            await apiService.inviteUser(projectId, email, role, token)
            setSuccessMessage(`Invitation sent to ${email}!`)
            setTimeout(() => setSuccessMessage(""), 5000)
            fetchProjectData()
            fetchPendingInvites()
        } catch (err) {
            throw new Error(err.message || "Failed to send invitation")
        } finally {
            setInviteLoading(false)
        }
    }

    const handleRoleChange = async (memberId, memberEmail, newRole) => {
        if (!isOwner) {
            setSuccessMessage("Only project owners can change member roles")
            setTimeout(() => setSuccessMessage(""), 3000)
            return
        }

        setRoleChangeLoading(memberId)
        try {
            await apiService.updateMemberRole(projectId, memberId, newRole, token)
            setSuccessMessage(`Successfully updated ${memberEmail}'s role to ${newRole}`)
            setTimeout(() => setSuccessMessage(""), 5000)
            await fetchProjectData()
        } catch (err) {
            console.error("Error updating role:", err)
            setSuccessMessage(`Failed to update role: ${err.message}`)
            setTimeout(() => setSuccessMessage(""), 5000)
        } finally {
            setRoleChangeLoading(null)
        }
    }

    const handleRemoveMember = async (memberId, memberEmail) => {
        if (!isOwner) {
            setSuccessMessage("Only project owners can remove members")
            setTimeout(() => setSuccessMessage(""), 3000)
            return
        }

        setMemberDeleteLoading(memberId)
        try {
            await apiService.removeProjectMember(projectId, memberId, token)
            setSuccessMessage(`Removed ${memberEmail} from this project`)
            setTimeout(() => setSuccessMessage(""), 5000)
            await fetchProjectData()
        } catch (err) {
            console.error("Error removing member:", err)
            setSuccessMessage(`Failed to remove member: ${err.message}`)
            setTimeout(() => setSuccessMessage(""), 5000)
        } finally {
            setMemberDeleteLoading(null)
        }
    }

    const handlePendingInviteRoleChange = async (inviteId, role) => {
        if (!isOwner) return

        setInviteActionLoading(inviteId)
        try {
            await apiService.updateProjectInviteRole(projectId, inviteId, role, token)
            setSuccessMessage(`Updated invitation role to ${role}`)
            setTimeout(() => setSuccessMessage(""), 5000)
            await fetchPendingInvites()
        } catch (err) {
            console.error("Error updating invite role:", err)
            setSuccessMessage(`Failed to update invite role: ${err.message}`)
            setTimeout(() => setSuccessMessage(""), 5000)
        } finally {
            setInviteActionLoading(null)
        }
    }

    const handleDeletePendingInvite = async (inviteId) => {
        if (!isOwner) return

        setInviteActionLoading(inviteId)
        try {
            await apiService.cancelProjectInvite(projectId, inviteId, token)
            setSuccessMessage("Invitation deleted successfully")
            setTimeout(() => setSuccessMessage(""), 5000)
            await fetchPendingInvites()
        } catch (err) {
            console.error("Error deleting invitation:", err)
            setSuccessMessage(`Failed to delete invitation: ${err.message}`)
            setTimeout(() => setSuccessMessage(""), 5000)
        } finally {
            setInviteActionLoading(null)
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "owner":
                return "border-[#D99A25]/45 bg-[#2B2112] text-[#F2B84B]"
            case "editor":
                return "border-[#D99A25]/35 bg-[#231E15] text-[#D99A25]"
            case "viewer":
                return "border-[#7B7567]/40 bg-[#1C1B18] text-[#A7A092]"
            default:
                return "border-[#7B7567]/40 bg-[#1C1B18] text-[#A7A092]"
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case "owner":
                return Crown
            case "editor":
                return Edit3
            case "viewer":
                return Eye
            default:
                return Users
        }
    }

    const getInitials = (name) => {
        if (!name) return "?"

        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const isOwner = teamMembers.some(
        (member) => member.user_id === user?.id && member.role === "owner"
    )

    const totalMembers = teamMembers.length

    const createdDate = projectData?.created_at
        ? new Date(projectData.created_at).toLocaleDateString()
        : "N/A"

    const cardClass =
        "rounded-2xl border border-[#3A2A12] bg-[#171613] shadow-[0_0_0_1px_rgba(217,154,37,0.04)] transition-all duration-200 hover:border-[#D99A25]/55 hover:shadow-[0_16px_42px_rgba(0,0,0,0.34)]"

    const iconBoxClass =
        "flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A2114] text-[#D99A25]"

    const mutedText = "text-[#8FA0B5]"
    const titleText = "text-[#F4F1E9]"

    if (loading) {
        return (
            <div className="flex min-h-[420px] items-center justify-center bg-[#11100D] p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#D99A25]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#11100D] text-[#F4F1E9]">
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
                loading={inviteLoading}
                projectId={projectId}
            />

            <div className="mx-auto w-full max-w-[1680px] px-8 py-9">
                {successMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#22C55E]/25 bg-[#122118] p-4 text-[#9CF3B0] shadow-[0_8px_28px_rgba(0,0,0,0.2)] animate-fade-in">
                        <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                        <span className="font-medium">{successMessage}</span>
                    </div>
                )}

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className={`${cardClass} p-7`}>
                        <div className="mb-8 flex items-start justify-between">
                            <span className={`text-base font-medium ${mutedText}`}>
                                Total Members
                            </span>
                            <div className={iconBoxClass}>
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-5xl font-bold tracking-tight text-[#D99A25]">
                            {totalMembers}
                        </div>
                    </Card>

                    <Card className={`${cardClass} p-7`}>
                        <div className="mb-8 flex items-start justify-between">
                            <span className={`text-base font-medium ${mutedText}`}>
                                Created On
                            </span>
                            <div className={iconBoxClass}>
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold tracking-tight text-[#D99A25]">
                            {createdDate}
                        </div>
                    </Card>

                    <Card className={`${cardClass} p-7`}>
                        <div className="mb-8 flex items-start justify-between">
                            <span className={`text-base font-medium ${mutedText}`}>
                                Pending Invites
                            </span>
                            <div className={iconBoxClass}>
                                <Mail className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-5xl font-bold tracking-tight text-[#D99A25]">
                            {pendingInvites.length}
                        </div>
                    </Card>
                </div>

                <section className="mb-12">
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className={`mb-2 text-3xl font-bold ${titleText}`}>
                                Project Collaborators
                            </h2>
                            <p className={`text-base ${mutedText}`}>
                                Manage your team members and their access levels
                            </p>
                        </div>

                        {isOwner && (
                            <Button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="gap-2 rounded-xl border border-[#D99A25]/40 bg-[#D99A25] px-5 py-5 font-semibold text-[#11100D] shadow-[0_10px_24px_rgba(217,154,37,0.22)] hover:bg-[#F2B84B]"
                            >
                                <UserPlus className="h-4 w-4" />
                                Invite Team Member
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
                        <div>
                            <h3 className={`mb-2 text-xl font-bold ${titleText}`}>
                                Team Members
                            </h3>
                            <p className={`mb-5 text-base ${mutedText}`}>
                                All members with access to this project
                            </p>

                            <div className="space-y-4">
                                {teamMembers.length === 0 ? (
                                    <Card className={`${cardClass} p-10 text-center`}>
                                        <Users className="mx-auto mb-4 h-12 w-12 text-[#6F6759]" />
                                        <p className={mutedText}>No team members yet</p>
                                    </Card>
                                ) : (
                                    teamMembers.map((member) => {
                                        const RoleIcon = getRoleIcon(member.role)
                                        const canManageMember =
                                            isOwner &&
                                            member.user_id !== user?.id &&
                                            member.role !== "owner"
                                        const isChangingRole = roleChangeLoading === member.user_id
                                        const isDeletingMember = memberDeleteLoading === member.user_id
                                        const isMemberActionLoading =
                                            isChangingRole || isDeletingMember

                                        return (
                                            <Card
                                                key={member.user_id}
                                                className={`${cardClass} p-5`}
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <Avatar className="h-12 w-12 border border-[#D99A25]/20 bg-[#2A2114]">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_email}`}
                                                            />
                                                            <AvatarFallback className="bg-[#2A2114] text-[#D99A25]">
                                                                {getInitials(
                                                                    member.user_name ||
                                                                        member.user_email
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-[#F4F1E9]">
                                                                {member.user_name ||
                                                                    "Unknown User"}
                                                            </p>
                                                            <p className="truncate text-sm text-[#8FA0B5]">
                                                                {member.user_email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                        <Badge
                                                            variant="outline"
                                                            className={`${getRoleBadgeColor(
                                                                member.role
                                                            )} rounded-full px-3 py-1`}
                                                        >
                                                            <RoleIcon className="mr-1 h-3.5 w-3.5" />
                                                            {member.role}
                                                        </Badge>

                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full border-[#22C55E]/35 bg-[#122118] px-3 py-1 text-[#7EEA98]"
                                                        >
                                                            Active
                                                        </Badge>

                                                        {member.role === "owner" && (
                                                            <Star className="h-5 w-5 fill-[#D99A25] text-[#D99A25]" />
                                                        )}

                                                        {canManageMember && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-9 w-9 rounded-lg p-0 text-[#8FA0B5] hover:bg-[#2A2114] hover:text-[#D99A25]"
                                                                        disabled={
                                                                            isMemberActionLoading
                                                                        }
                                                                    >
                                                                        {isMemberActionLoading ? (
                                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                                        ) : (
                                                                            <MoreVertical className="h-5 w-5" />
                                                                        )}
                                                                    </Button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-48 border-[#3A2A12] bg-[#171613] text-[#F4F1E9]"
                                                                >
                                                                    <DropdownMenuSub>
                                                                        <DropdownMenuSubTrigger className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]">
                                                                            Change Role
                                                                        </DropdownMenuSubTrigger>

                                                                        <DropdownMenuSubContent className="w-44 border-[#3A2A12] bg-[#171613] text-[#F4F1E9]">
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleRoleChange(
                                                                                        member.user_id,
                                                                                        member.user_email,
                                                                                        "owner"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    member.role ===
                                                                                    "owner"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Crown className="mr-2 h-4 w-4 text-[#D99A25]" />
                                                                                <span>Owner</span>
                                                                                {member.role ===
                                                                                    "owner" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#D99A25]" />
                                                                                )}
                                                                            </DropdownMenuItem>

                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleRoleChange(
                                                                                        member.user_id,
                                                                                        member.user_email,
                                                                                        "editor"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    member.role ===
                                                                                    "editor"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Edit3 className="mr-2 h-4 w-4 text-[#D99A25]" />
                                                                                <span>Editor</span>
                                                                                {member.role ===
                                                                                    "editor" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#D99A25]" />
                                                                                )}
                                                                            </DropdownMenuItem>

                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleRoleChange(
                                                                                        member.user_id,
                                                                                        member.user_email,
                                                                                        "viewer"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    member.role ===
                                                                                    "viewer"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Eye className="mr-2 h-4 w-4 text-[#A7A092]" />
                                                                                <span>Viewer</span>
                                                                                {member.role ===
                                                                                    "viewer" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#A7A092]" />
                                                                                )}
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuSub>

                                                                    <DropdownMenuSeparator className="bg-[#3A2A12]" />

                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleRemoveMember(
                                                                                member.user_id,
                                                                                member.user_email
                                                                            )
                                                                        }
                                                                        className="cursor-pointer text-[#FF6565] hover:bg-[#2A1111] focus:bg-[#2A1111] focus:text-[#FF6565]"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        <span>
                                                                            Delete Member
                                                                        </span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className={`mb-2 text-xl font-bold ${titleText}`}>
                                Pending Invitations
                            </h3>
                            <p className={`mb-5 text-base ${mutedText}`}>
                                Invitations waiting for response
                            </p>

                            <div className="space-y-4">
                                {pendingInvites.length === 0 ? (
                                    <Card
                                        className={`${cardClass} flex min-h-[220px] flex-col items-center justify-center p-10 text-center`}
                                    >
                                        <Mail className="mb-5 h-16 w-16 text-[#566171]" />
                                        <p className="text-lg font-medium text-[#8FA0B5]">
                                            No pending invitations
                                        </p>
                                    </Card>
                                ) : (
                                    pendingInvites.map((invite) => {
                                        const inviteId = invite.id
                                        const isInviteLoading =
                                            inviteActionLoading === inviteId

                                        return (
                                            <Card
                                                key={inviteId}
                                                className={`${cardClass} p-5`}
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <Avatar className="h-12 w-12 border border-[#D99A25]/20 bg-[#2A2114]">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.invitee}`}
                                                            />
                                                            <AvatarFallback className="bg-[#2A2114] text-[#D99A25]">
                                                                {getInitials(
                                                                    invite.invitee ||
                                                                        "User"
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-[#F4F1E9]">
                                                                {invite.invitee}
                                                            </p>
                                                            <p className="truncate text-sm text-[#8FA0B5]">
                                                                Invited by{" "}
                                                                {invite.inviter}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full border-[#D99A25]/35 bg-[#231E15] px-3 py-1 text-[#D99A25]"
                                                        >
                                                            {invite.role}
                                                        </Badge>

                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full border-[#D99A25]/35 bg-[#2A2114] px-3 py-1 text-[#F2B84B]"
                                                        >
                                                            Pending
                                                        </Badge>

                                                        {isOwner && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-9 w-9 rounded-lg p-0 text-[#8FA0B5] hover:bg-[#2A2114] hover:text-[#D99A25]"
                                                                        disabled={
                                                                            isInviteLoading
                                                                        }
                                                                    >
                                                                        {isInviteLoading ? (
                                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                                        ) : (
                                                                            <MoreVertical className="h-5 w-5" />
                                                                        )}
                                                                    </Button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-52 border-[#3A2A12] bg-[#171613] text-[#F4F1E9]"
                                                                >
                                                                    <DropdownMenuSub>
                                                                        <DropdownMenuSubTrigger className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]">
                                                                            Change Role
                                                                        </DropdownMenuSubTrigger>

                                                                        <DropdownMenuSubContent className="w-44 border-[#3A2A12] bg-[#171613] text-[#F4F1E9]">
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePendingInviteRoleChange(
                                                                                        inviteId,
                                                                                        "owner"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    invite.role ===
                                                                                    "owner"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Crown className="mr-2 h-4 w-4 text-[#D99A25]" />
                                                                                <span>Owner</span>
                                                                                {invite.role ===
                                                                                    "owner" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#D99A25]" />
                                                                                )}
                                                                            </DropdownMenuItem>

                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePendingInviteRoleChange(
                                                                                        inviteId,
                                                                                        "editor"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    invite.role ===
                                                                                    "editor"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Edit3 className="mr-2 h-4 w-4 text-[#D99A25]" />
                                                                                <span>Editor</span>
                                                                                {invite.role ===
                                                                                    "editor" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#D99A25]" />
                                                                                )}
                                                                            </DropdownMenuItem>

                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePendingInviteRoleChange(
                                                                                        inviteId,
                                                                                        "viewer"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    invite.role ===
                                                                                    "viewer"
                                                                                }
                                                                                className="cursor-pointer hover:bg-[#2A2114] focus:bg-[#2A2114]"
                                                                            >
                                                                                <Eye className="mr-2 h-4 w-4 text-[#A7A092]" />
                                                                                <span>Viewer</span>
                                                                                {invite.role ===
                                                                                    "viewer" && (
                                                                                    <CheckCircle className="ml-auto h-4 w-4 text-[#A7A092]" />
                                                                                )}
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuSub>

                                                                    <DropdownMenuSeparator className="bg-[#3A2A12]" />

                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDeletePendingInvite(
                                                                                inviteId
                                                                            )
                                                                        }
                                                                        className="cursor-pointer text-[#FF6565] hover:bg-[#2A1111] focus:bg-[#2A1111] focus:text-[#FF6565]"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        <span>Delete Invite</span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className={`mb-6 text-3xl font-bold ${titleText}`}>
                        Role Permissions
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className={`${cardClass} p-7`}>
                            <div className="mb-6 flex items-center gap-4">
                                <div className={iconBoxClass}>
                                    <Crown className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gold-solid">
                                    Owner
                                </h3>
                            </div>

                            <ul className="space-y-3 text-sm leading-relaxed text-foreground">
                                <li><span className="text-gold-solid">•</span> Full project access</li>
                                <li><span className="text-gold-solid">•</span> Manage team members</li>
                                <li><span className="text-gold-solid">•</span> Delete project</li>
                                <li><span className="text-gold-solid">•</span> Change project settings</li>
                            </ul>
                        </Card>

                        <Card className={`${cardClass} p-7`}>
                            <div className="mb-6 flex items-center gap-4">
                                <div className={iconBoxClass}>
                                    <Edit3 className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gold-solid">
                                    Editor
                                </h3>
                            </div>

                            <ul className="space-y-3 text-sm leading-relaxed text-foreground">
                                <li><span className="text-gold-solid">•</span> Edit project content</li>
                                <li><span className="text-gold-solid">•</span> Upload and manage images</li>
                                <li><span className="text-gold-solid">•</span> Modify workflows</li>
                                <li><span className="text-gold-solid">•</span> Cannot manage team</li>
                            </ul>
                        </Card>

                        <Card className={`${cardClass} p-7`}>
                            <div className="mb-6 flex items-center gap-4">
                                <div className={iconBoxClass}>
                                    <Eye className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gold-solid">
                                    Viewer
                                </h3>
                            </div>

                            <ul className="space-y-3 text-sm leading-relaxed text-foreground">
                                <li><span className="text-gold-solid">•</span> View project details</li>
                                <li><span className="text-gold-solid">•</span> View all images</li>
                                <li><span className="text-gold-solid">•</span> Cannot make changes</li>
                                <li><span className="text-gold-solid">•</span> Cannot invite others</li>
                            </ul>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}