'use client'
import {IUser} from "@/lib/response/user";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UpdateUserRequest} from "@/lib/request/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";

export function DialogEditProfile({
                                      user,
                                      handleEditProfile
                                  }: {
    user: IUser,
    handleEditProfile: (request: UpdateUserRequest) => void,
}) {
    const [fullName,setFullName] = useState(user.fullName??'')
    const [email, setEmail] = useState(user.email??'')
    const [phone,setPhone] = useState(user.phoneNumber??'')
    const [dob,setDob] = useState(user.dateOfBirth??'')
    const [gender,setGender] = useState<number>(user.gender??-1)
    const [avtPath,setAvtPath] = useState(user.avtPath|| '')
    const [password,setPassword] = useState('')
    const handleSubmit = () => {
        const request = {
            password: password,
            email: email,
            phoneNumber: phone,
            fullName: fullName,
            avtPath: avtPath,
            dateOfBirth: dob,
            gender:gender
        } as UpdateUserRequest
        handleEditProfile(request)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[470px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            Avatar
                        </Label>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={avtPath} alt="Avatar" />
                            <AvatarFallback>Your avatar</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            Full name
                        </Label>
                        <Input id="fullName" onChange={(e) => {
                            setFullName(e.target.value)
                        }} value={fullName} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone number
                        </Label>
                        <Input id="phone" value={phone} onChange={(e) => {
                            setPhone(e.target.value)
                        }} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dob" className="text-right">
                            DOB
                        </Label>
                        <Input id="dob" value={dob} onChange={(e) => {
                            setDob(e.target.value)
                        }} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            New password
                        </Label>
                        <Input id="password" value={password} onChange={(e) => {
                            setPassword(e.target.value)
                        }} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                            Gender
                        </Label>
                        <Select
                            value={gender.toString()}
                            onValueChange={(value) => setGender(parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Nam</SelectItem>
                                <SelectItem value="1">Nữ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}