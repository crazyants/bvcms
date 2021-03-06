CREATE TABLE [lookup].[ContactReason]
(
[Id] [int] NOT NULL,
[Code] [nvarchar] (20) NOT NULL,
[Description] [nvarchar] (100) NOT NULL,
[Hardwired] [bit] NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
