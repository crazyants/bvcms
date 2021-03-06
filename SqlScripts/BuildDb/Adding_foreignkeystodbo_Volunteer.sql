ALTER TABLE [dbo].[Volunteer] WITH NOCHECK  ADD CONSTRAINT [FK_Volunteer_VolApplicationStatus] FOREIGN KEY ([StatusId]) REFERENCES [lookup].[VolApplicationStatus] ([Id])
ALTER TABLE [dbo].[Volunteer] WITH NOCHECK  ADD CONSTRAINT [StatusMvrId__StatusMvr] FOREIGN KEY ([MVRStatusId]) REFERENCES [lookup].[VolApplicationStatus] ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
